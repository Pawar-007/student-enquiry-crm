import { useState } from 'react';
import { Plus, Ban, CheckCircle2, Pencil } from 'lucide-react';
import { getCounsellors, createUser, updateUser, blockUser, unblockUser } from '../../api/userApi';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/FormField';
import { USER_STATUS, ROLES } from '../../constants/enums';
import { isRequired, isValidEmail, isTenDigitMobile, minLength, maxLength, runValidators } from '../../utils/validators';
import { formatDate } from '../../utils/format';

const emptyForm = { name: '', email: '', password: '', mobile: '' };

export default function Counsellors() {
  const { data: counsellors, loading, error, refetch, setData } = useApi(getCounsellors, []);
  const toast = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [blockTarget, setBlockTarget] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (counsellor) => {
    setEditing(counsellor);
    setForm({ name: counsellor.name, email: counsellor.email, password: '', mobile: counsellor.mobile || '' });
    setErrors({});
    setDrawerOpen(true);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const schema = {
      name: [isRequired, maxLength(100)],
      email: [isRequired, isValidEmail],
      mobile: [isRequired, isTenDigitMobile],
      ...(editing ? {} : { password: [isRequired, minLength(6)] }),
    };
    const validationErrors = runValidators(form, schema);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateUser(editing.userId, { ...form, role: ROLES.COUNSELLOR });
        setData((prev) => prev.map((c) => (c.userId === editing.userId ? { ...c, ...updated } : c)));
        toast.success('Counsellor updated successfully');
      } else {
        const created = await createUser({ ...form, role: ROLES.COUNSELLOR });
        setData((prev) => (prev ? [created, ...prev] : [created]));
        toast.success('Counsellor added successfully');
      }
      setDrawerOpen(false);
    } catch (err) {
      if (err.validationErrors) setErrors(err.validationErrors);
      else toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!blockTarget) return;
    setBlocking(true);
    const isBlocked = blockTarget.status === 'BLOCKED';
    try {
      const action = isBlocked ? unblockUser : blockUser;
      await action(blockTarget.userId);
      setData((prev) => prev.map((c) => (c.userId === blockTarget.userId ? { ...c, status: isBlocked ? 'ACTIVE' : 'BLOCKED' } : c)));
      toast.success(`Counsellor ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      setBlockTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBlocking(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge list={USER_STATUS} value={r.status} /> },
    { key: 'createdAt', header: 'Joined', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title="Counsellors"
        description="Manage counsellor accounts and access."
        actions={<Button icon={Plus} onClick={openCreate}>Add Counsellor</Button>}
      />

      <DataTable
        columns={columns}
        rows={counsellors}
        keyField="userId"
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle="No counsellors found"
        emptyDescription="Add your first counsellor to start assigning enquiries."
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(row)}>Edit</Button>
            <Button
              size="sm"
              variant={row.status === 'BLOCKED' ? 'secondary' : 'danger'}
              icon={row.status === 'BLOCKED' ? CheckCircle2 : Ban}
              onClick={() => setBlockTarget(row)}
            >
              {row.status === 'BLOCKED' ? 'Unblock' : 'Block'}
            </Button>
          </div>
        )}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Counsellor' : 'Add Counsellor'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Save Changes' : 'Add Counsellor'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="cName" label="Name" required maxLength={100} value={form.name} onChange={setField('name')} error={errors.name} />
          <Input id="cEmail" label="Email" type="email" required value={form.email} onChange={setField('email')} error={errors.email} />
          <Input id="cMobile" label="Mobile" required maxLength={10} value={form.mobile} onChange={setField('mobile')} error={errors.mobile} hint="Exactly 10 digits" />
          {!editing && (
            <Input id="cPassword" label="Password" type="password" required value={form.password} onChange={setField('password')} error={errors.password} hint="Minimum 6 characters" />
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleToggleBlock}
        loading={blocking}
        tone={blockTarget?.status === 'BLOCKED' ? 'primary' : 'danger'}
        title={blockTarget?.status === 'BLOCKED' ? 'Unblock counsellor?' : 'Block counsellor?'}
        confirmLabel={blockTarget?.status === 'BLOCKED' ? 'Unblock' : 'Block'}
        description={
          blockTarget?.status === 'BLOCKED'
            ? `${blockTarget?.name} will regain access to sign in and manage their enquiries.`
            : `${blockTarget?.name} will immediately lose access to sign in. Their existing enquiries remain assigned.`
        }
      />
    </div>
  );
}
