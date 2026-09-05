import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, ListTree, Layers } from 'lucide-react';
import { getCourseById } from '../../api/courseApi';
import { getModulesByCourse } from '../../api/moduleApi';
import { getBatchesByCourse } from '../../api/batchApi';
import { useApi } from '../../hooks/useApi';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonLine } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { BATCH_STATUS } from '../../constants/enums';
import { formatCurrency, formatDate } from '../../utils/format';

export default function CourseAdminDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: course, loading, error, refetch } = useApi(() => getCourseById(courseId), [courseId]);
  const { data: modules } = useApi(() => getModulesByCourse(courseId), [courseId]);
  const { data: batches } = useApi(() => getBatchesByCourse(courseId), [courseId]);

  if (loading) return <SkeletonLine className="w-1/2 h-8" />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!course) return null;

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/courses')} className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] mb-5">
        <ChevronLeft size={16} /> Back to courses
      </button>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6">
        <h1 className="font-display text-2xl text-[var(--color-ink)]">{course.courseName}</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">{course.description}</p>
        <div className="flex flex-wrap gap-6 mt-4 text-sm text-[var(--color-muted)]">
          <span>Duration: <span className="text-[var(--color-ink)]">{course.duration || '—'}</span></span>
          <span>Fees: <span className="text-[var(--color-ink)]">{formatCurrency(course.fees)}</span></span>
          <span>Created by: <span className="text-[var(--color-ink)]">{course.createdBy?.name || '—'}</span></span>
          <span>Created: <span className="text-[var(--color-ink)]">{formatDate(course.createdAt)}</span></span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] flex items-center gap-2"><ListTree size={14} /> Modules</p>
            <Button as={Link} to="/admin/modules" size="sm" variant="ghost">Manage</Button>
          </div>
          {modules?.length ? (
            <ul className="flex flex-col gap-2">
              {[...modules].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0)).map((m) => (
                <li key={m.moduleId} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-ink)]">{m.moduleOrder}. {m.moduleName}</span>
                  <span className="text-[var(--color-muted)]">{m.duration}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No modules added yet.</p>
          )}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] flex items-center gap-2"><Layers size={14} /> Batches</p>
            <Button as={Link} to="/admin/batches" size="sm" variant="ghost">Manage</Button>
          </div>
          {batches?.length ? (
            <ul className="flex flex-col gap-3">
              {batches.map((b) => (
                <li key={b.batchId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-[var(--color-ink)]">{b.batchName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{formatDate(b.startDate)} – {formatDate(b.endDate)}</p>
                  </div>
                  <StatusBadge list={BATCH_STATUS} value={b.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No batches added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
