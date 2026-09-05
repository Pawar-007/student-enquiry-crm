import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../api/teacherApi';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/FormField';
import { isRequired, isValidEmail, isTenDigitMobile, runValidators } from '../../utils/validators';

const emptyForm = { name: '', email: '', mobile: '', expertise: '' };

export default function Teachers() {
  const { data: teachers, loading, error, refetch, setData } = useApi(getTeachers, []);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!teachers) return [];
    const q = search.toLowerCase();
    return q ? teachers.filter((t) => t.name?.toLowerCase().includes(q) || t.expertise?.toLowerCase().includes(q)) : teachers;
  }, [teachers, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setDrawerOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, email: t.email, mobile: t.mobile, expertise: t.expertise || '' }); setErrors({}); setDrawerOpen(true); };
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const validationErrors = runValidators(form, {
      name: [isRequired], email: [isRequired, isValidEmail], mobile: [isRequired, isTenDigitMobile],
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateTeacher(editing.teacherId, form);
        setData((prev) => prev.map((t) => (t.teacherId === editing.teacherId ? { ...t, ...updated } : t)));
        toast.success('Teacher updated successfully');
      } else {
        const created = await createTeacher(form);
        setData((prev) => (prev ? [created, ...prev] : [created]));
        toast.success('Teacher added successfully');
      }
      setDrawerOpen(false);
    } catch (err) {
      if (err.validationErrors) setErrors(err.validationErrors);
      else toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTeacher(deleteTarget.teacherId);
      setData((prev) => prev.filter((t) => t.teacherId !== deleteTarget.teacherId));
      toast.success('Teacher deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'expertise', header: 'Expertise' },
  ];

  return (
    <div>
      <PageHeader title="Teachers" description="Directory of teachers available for module assignment." actions={<Button icon={Plus} onClick={openCreate}>Add Teacher</Button>} />

      <div className="relative max-w-sm mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or expertise…"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]/30"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        keyField="teacherId"
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle="No teachers found"
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(row)}>Edit</Button>
            <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteTarget(row)}>Delete</Button>
          </div>
        )}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Teacher' : 'Add Teacher'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Save Changes' : 'Add Teacher'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="tName" label="Name" required value={form.name} onChange={setField('name')} error={errors.name} />
          <Input id="tEmail" label="Email" type="email" required value={form.email} onChange={setField('email')} error={errors.email} />
          <Input id="tMobile" label="Mobile" required maxLength={10} value={form.mobile} onChange={setField('mobile')} error={errors.mobile} />
          <Input id="tExpertise" label="Expertise" value={form.expertise} onChange={setField('expertise')} error={errors.expertise} placeholder="e.g. React, Data Structures" />
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete teacher?"
        description={`${deleteTarget?.name} will be permanently removed, along with any module assignments.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
