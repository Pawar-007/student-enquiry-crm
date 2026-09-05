import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { getCourses } from '../../api/courseApi';
import { getBatchesByCourse, createBatch, updateBatch } from '../../api/batchApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import StatusBadge from '../../components/ui/StatusBadge';
import { Input, Select } from '../../components/ui/FormField';
import { BATCH_STATUS } from '../../constants/enums';
import { formatDate, toDateInputValue } from '../../utils/format';
import { isRequired, runValidators } from '../../utils/validators';
import EmptyState from '../../components/ui/EmptyState';
import { Layers } from 'lucide-react';

const emptyForm = { batchName: '', startDate: '', endDate: '', timing: '', status: '' };

export default function Batches() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCourses().then((cs) => {
      setCourses(cs);
      if (cs.length > 0) setCourseId(String(cs[0].courseId));
    }).catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getBatchesByCourse(courseId).then(setBatches).catch(() => setBatches([])).finally(() => setLoading(false));
  }, [courseId]);

  const courseOptions = useMemo(() => courses.map((c) => ({ value: String(c.courseId), label: c.courseName })), [courses]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setDrawerOpen(true); };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ batchName: b.batchName, startDate: toDateInputValue(b.startDate), endDate: toDateInputValue(b.endDate), timing: b.timing || '', status: b.status || '' });
    setErrors({});
    setDrawerOpen(true);
  };
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const validationErrors = runValidators(form, {
      batchName: [isRequired], startDate: [isRequired], endDate: [isRequired], status: [isRequired],
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = { ...form, courseId: Number(courseId) };
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateBatch(editing.batchId, payload);
        setBatches((prev) => prev.map((b) => (b.batchId === editing.batchId ? { ...b, ...updated } : b)));
        toast.success('Batch updated successfully');
      } else {
        const created = await createBatch(payload);
        setBatches((prev) => [created, ...prev]);
        toast.success('Batch created successfully');
      }
      setDrawerOpen(false);
    } catch (err) {
      if (err.validationErrors) setErrors(err.validationErrors);
      else toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'batchName', header: 'Batch', render: (r) => <span className="font-medium">{r.batchName}</span> },
    { key: 'startDate', header: 'Start', render: (r) => formatDate(r.startDate) },
    { key: 'endDate', header: 'End', render: (r) => formatDate(r.endDate) },
    { key: 'timing', header: 'Timing' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge list={BATCH_STATUS} value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Batches" description="Manage batches per course." actions={<Button icon={Plus} onClick={openCreate} disabled={!courseId}>Add Batch</Button>} />

      <div className="w-64 mb-5">
        <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} options={courseOptions} placeholder="Select a course" />
      </div>

      {!courseId ? (
        <EmptyState icon={Layers} title="Select a course" description="Choose a course above to view and manage its batches." />
      ) : (
        <DataTable
          columns={columns}
          rows={batches}
          keyField="batchId"
          loading={loading}
          emptyTitle="No batches for this course"
          rowActions={(row) => <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(row)}>Edit</Button>}
        />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Batch' : 'Add Batch'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Save Changes' : 'Create Batch'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="batchName" label="Batch Name" required value={form.batchName} onChange={setField('batchName')} error={errors.batchName} />
          <Input id="startDate" label="Start Date" type="date" required value={form.startDate} onChange={setField('startDate')} error={errors.startDate} />
          <Input id="endDate" label="End Date" type="date" required value={form.endDate} onChange={setField('endDate')} error={errors.endDate} />
          <Input id="timing" label="Timing" placeholder="e.g. Mon–Fri, 7–9 PM" value={form.timing} onChange={setField('timing')} error={errors.timing} />
          <Select id="status" label="Status" required value={form.status} onChange={setField('status')} options={BATCH_STATUS} error={errors.status} />
        </div>
      </Drawer>
    </div>
  );
}
