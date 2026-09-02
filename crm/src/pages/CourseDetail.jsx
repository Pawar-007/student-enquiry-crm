import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Layers, CalendarRange } from 'lucide-react'
import { useCourse } from '../features/courses/hooks'
import { useModulesByCourse } from '../features/modules/hooks'
import { useBatchesByCourse } from '../features/batches/hooks'
import { CardSkeleton } from '../components/Skeleton'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: course, isLoading } = useCourse(id)
  const { data: modules, isLoading: modulesLoading } = useModulesByCourse(id)
  const { data: batches, isLoading: batchesLoading } = useBatchesByCourse(id)

  if (isLoading || !course) {
    return <div className="max-w-3xl space-y-4"><CardSkeleton /><CardSkeleton /></div>
  }

  return (
    <div className="max-w-3xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <h1 className="text-lg font-bold text-ink">{course.name}</h1>
        {course.description && <p className="mt-2 text-sm text-ink-soft">{course.description}</p>}
        {course.duration && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">{course.duration}</p>}
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><Layers size={16} /> Modules</h2>
        {modulesLoading ? (
          <div className="mt-3 space-y-2"><CardSkeleton /></div>
        ) : (modules || []).length === 0 ? (
          <p className="mt-3 text-sm text-ink-faint">No modules added yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border-soft">
            {modules.map((m) => (
              <li key={m.id} className="py-2.5 text-sm text-ink-soft">
                <span className="font-medium text-ink">{m.name}</span>
                {m.description && <span className="text-ink-faint"> — {m.description}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><CalendarRange size={16} /> Batches</h2>
        {batchesLoading ? (
          <div className="mt-3 space-y-2"><CardSkeleton /></div>
        ) : (batches || []).length === 0 ? (
          <p className="mt-3 text-sm text-ink-faint">No batches scheduled yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border-soft">
            {batches.map((b) => (
              <li key={b.id} className="py-2.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{b.name || b.batchName}</span>
                <span className="num text-ink-faint">{b.startDate} → {b.endDate}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
