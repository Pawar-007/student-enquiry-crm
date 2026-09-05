import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courseApi';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Input, Textarea } from '../../components/ui/FormField';
import { formatCurrency } from '../../utils/format';
import { isRequired, maxLength, nonNegativeNumber, runValidators } from '../../utils/validators';

const emptyForm = { courseName: '', description: '', duration: '', fees: '', brochurePdf: '' };

export default function Courses() {
  const { data: courses, loading, error, refetch, setData } = useApi(getCourses, []);
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = search.toLowerCase();
    return q ? courses.filter((c) => c.courseName?.toLowerCase().includes(q)) : courses;
  }, [courses, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setDrawerOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ courseName: c.courseName, description: c.description || '', duration: c.duration || '', fees: String(c.fees ?? ''), brochurePdf: c.brochurePdf || '' });
    setErrors({});
    setDrawerOpen(true);
  };
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const validationErrors = runValidators(form, {
      courseName: [isRequired, maxLength(150)],
      duration: [maxLength(50)],
      fees: [isRequired, nonNegativeNumber],
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = { ...form, fees: Number(form.fees) };
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateCourse(editing.courseId, payload);
        setData((prev) => prev.map((c) => (c.courseId === editing.courseId ? { ...c, ...updated } : c)));
        toast.success('Course updated successfully');
      } else {
        const created = await createCourse(payload);
        setData((prev) => (prev ? [created, ...prev] : [created]));
        toast.success('Course created successfully');
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
      await deleteCourse(deleteTarget.courseId);
      setData((prev) => prev.filter((c) => c.courseId !== deleteTarget.courseId));
      toast.success('Course deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'courseName', header: 'Course', render: (r) => <span className="font-medium">{r.courseName}</span> },
    { key: 'duration', header: 'Duration' },
    { key: 'fees', header: 'Fees', render: (r) => formatCurrency(r.fees) },
    { key: 'createdBy', header: 'Created By', render: (r) => r.createdBy?.name || '—' },
  ];

  return (
    <div>
      <PageHeader title="Courses" description="Manage the programs shown on the public website." actions={<Button icon={Plus} onClick={openCreate}>Add Course</Button>} />

      <div className="relative max-w-sm mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]/30"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        keyField="courseId"
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle="No courses available"
        rowActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" icon={Eye} onClick={() => navigate(`/admin/courses/${row.courseId}`)}>View</Button>
            <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(row)}>Edit</Button>
            <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteTarget(row)}>Delete</Button>
          </div>
        )}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Course' : 'Add Course'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Save Changes' : 'Create Course'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="courseName" label="Course Name" required maxLength={150} value={form.courseName} onChange={setField('courseName')} error={errors.courseName} />
          <Textarea id="description" label="Description" value={form.description} onChange={setField('description')} error={errors.description} />
          <Input id="duration" label="Duration" maxLength={50} placeholder="e.g. 12 weeks" value={form.duration} onChange={setField('duration')} error={errors.duration} />
          <Input id="fees" label="Fees" type="number" min="0" required value={form.fees} onChange={setField('fees')} error={errors.fees} />
          <Input id="brochurePdf" label="Brochure URL" value={form.brochurePdf} onChange={setField('brochurePdf')} error={errors.brochurePdf} placeholder="Optional link to PDF" />
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete course?"
        description={`${deleteTarget?.courseName} will be permanently deleted, including its association with modules and batches.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
