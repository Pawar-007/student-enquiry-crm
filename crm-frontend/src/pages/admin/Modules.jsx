import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ListTree } from 'lucide-react';
import { getCourses } from '../../api/courseApi';
import { getModulesByCourse, createModule, updateModule, deleteModule } from '../../api/moduleApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { Input, Select } from '../../components/ui/FormField';
import { isRequired, runValidators } from '../../utils/validators';

const emptyForm = { moduleName: '', moduleOrder: '', duration: '' };

export default function Modules() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCourses().then((cs) => {
      setCourses(cs);
      if (cs.length > 0) setCourseId(String(cs[0].courseId));
    }).catch(() => setCourses([]));
  }, []);

  const loadModules = () => {
    if (!courseId) return;
    setLoading(true);
    getModulesByCourse(courseId).then((data) => setModules([...data].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0)))).catch(() => setModules([])).finally(() => setLoading(false));
  };

  useEffect(loadModules, [courseId]);

  const courseOptions = useMemo(() => courses.map((c) => ({ value: String(c.courseId), label: c.courseName })), [courses]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setDrawerOpen(true); };
  const openEdit = (m) => { setEditing(m); setForm({ moduleName: m.moduleName, moduleOrder: String(m.moduleOrder ?? ''), duration: m.duration || '' }); setErrors({}); setDrawerOpen(true); };
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const validationErrors = runValidators(form, { moduleName: [isRequired], moduleOrder: [isRequired] });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = { ...form, moduleOrder: Number(form.moduleOrder), courseId: Number(courseId) };
    setSubmitting(true);
    try {
      if (editing) {
        await updateModule(editing.moduleId, payload);
        toast.success('Module updated successfully');
      } else {
        await createModule(payload);
        toast.success('Module added successfully');
      }
      setDrawerOpen(false);
      loadModules();
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
      await deleteModule(deleteTarget.moduleId);
      setModules((prev) => prev.filter((m) => m.moduleId !== deleteTarget.moduleId));
      toast.success('Module deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'moduleOrder', header: 'Order' },
    { key: 'moduleName', header: 'Module', render: (r) => <span className="font-medium">{r.moduleName}</span> },
    { key: 'duration', header: 'Duration' },
  ];

  return (
    <div>
      <PageHeader title="Course Modules" description="Break each course into ordered modules." actions={<Button icon={Plus} onClick={openCreate} disabled={!courseId}>Add Module</Button>} />

      <div className="w-64 mb-5">
        <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} options={courseOptions} placeholder="Select a course" />
      </div>

      {!courseId ? (
        <EmptyState icon={ListTree} title="Select a course" description="Choose a course above to view and manage its modules." />
      ) : (
        <DataTable
          columns={columns}
          rows={modules}
          keyField="moduleId"
          loading={loading}
          emptyTitle="No modules for this course"
          rowActions={(row) => (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(row)}>Edit</Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteTarget(row)}>Delete</Button>
            </div>
          )}
        />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Module' : 'Add Module'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Save Changes' : 'Add Module'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input id="moduleName" label="Module Name" required value={form.moduleName} onChange={setField('moduleName')} error={errors.moduleName} />
          <Input id="moduleOrder" label="Module Order" type="number" min="1" required value={form.moduleOrder} onChange={setField('moduleOrder')} error={errors.moduleOrder} />
          <Input id="duration" label="Duration" placeholder="e.g. 1 week" value={form.duration} onChange={setField('duration')} error={errors.duration} />
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete module?"
        description={`${deleteTarget?.moduleName} will be permanently removed from this course.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
