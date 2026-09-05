import { useEffect, useMemo, useState } from 'react';
import { Link2, Trash2, Plus } from 'lucide-react';
import { getCourses } from '../../api/courseApi';
import { getModulesByCourse } from '../../api/moduleApi';
import { getTeachers } from '../../api/teacherApi';
import { getMappingsByModule, assignTeacherToModule, removeModuleTeacherMapping } from '../../api/moduleTeacherMappingApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

export default function TeacherAssignments() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [mappingsByModule, setMappingsByModule] = useState({});
  const [selection, setSelection] = useState({});
  const [assigningModuleId, setAssigningModuleId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getCourses().then((cs) => {
      setCourses(cs);
      if (cs.length > 0) setCourseId(String(cs[0].courseId));
    }).catch(() => setCourses([]));
    getTeachers().then(setTeachers).catch(() => setTeachers([]));
  }, []);

  const loadModulesAndMappings = async () => {
    if (!courseId) return;
    const mods = await getModulesByCourse(courseId).catch(() => []);
    const sorted = [...mods].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0));
    setModules(sorted);
    const entries = await Promise.all(sorted.map((m) => getMappingsByModule(m.moduleId).catch(() => [])));
    const map = {};
    sorted.forEach((m, i) => { map[m.moduleId] = entries[i]; });
    setMappingsByModule(map);
  };

  useEffect(() => { loadModulesAndMappings(); /* eslint-disable-next-line */ }, [courseId]);

  const courseOptions = useMemo(() => courses.map((c) => ({ value: String(c.courseId), label: c.courseName })), [courses]);
  const teacherOptions = useMemo(() => teachers.map((t) => ({ value: String(t.teacherId), label: t.name })), [teachers]);

  const handleAssign = async (moduleId) => {
    const teacherId = selection[moduleId];
    if (!teacherId) {
      toast.error('Select a teacher first.');
      return;
    }
    setAssigningModuleId(moduleId);
    try {
      await assignTeacherToModule({ moduleId: Number(moduleId), teacherId: Number(teacherId) });
      toast.success('Teacher assigned successfully');
      await loadModulesAndMappings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigningModuleId(null);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeModuleTeacherMapping(removeTarget.mappingId);
      toast.success('Assignment removed');
      setRemoveTarget(null);
      await loadModulesAndMappings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Teacher Assignments" description="Assign a teacher to each course module." />

      <div className="w-64 mb-6">
        <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} options={courseOptions} placeholder="Select a course" />
      </div>

      {!courseId || modules.length === 0 ? (
        <EmptyState icon={Link2} title="No modules to assign" description="Add modules for this course first, then come back here to assign teachers." />
      ) : (
        <div className="flex flex-col gap-4">
          {modules.map((mod) => {
            const mappings = mappingsByModule[mod.moduleId] || [];
            return (
              <div key={mod.moduleId} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-medium text-[var(--color-ink)]">{mod.moduleOrder}. {mod.moduleName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{mod.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-44">
                      <Select
                        aria-label="Select teacher"
                        placeholder="Assign teacher"
                        value={selection[mod.moduleId] || ''}
                        onChange={(e) => setSelection((s) => ({ ...s, [mod.moduleId]: e.target.value }))}
                        options={teacherOptions}
                      />
                    </div>
                    <Button size="sm" icon={Plus} loading={assigningModuleId === mod.moduleId} onClick={() => handleAssign(mod.moduleId)}>Assign</Button>
                  </div>
                </div>
                {mappings.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--color-border-soft)] pt-4">
                    {mappings.map((m) => (
                      <li key={m.mappingId} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-[var(--color-ink)] font-medium">{m.teacher?.name}</span>
                          <span className="text-[var(--color-muted)]"> — {m.teacher?.expertise}</span>
                          <span className="text-[var(--color-muted)] text-xs ml-2">since {formatDate(m.assignedDate)}</span>
                        </div>
                        <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setRemoveTarget(m)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        loading={removing}
        title="Remove teacher assignment?"
        description={`${removeTarget?.teacher?.name} will no longer be assigned to this module.`}
        confirmLabel="Remove"
      />
    </div>
  );
}
