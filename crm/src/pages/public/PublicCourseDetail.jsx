import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, IndianRupee, FileDown, Layers } from 'lucide-react'
import { usePublicCourse } from '../../features/public/hooks'
import Button from '../../components/Button'
import { CardSkeleton } from '../../components/Skeleton'

function formatFees(n) {
  if (n == null) return null
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function PublicCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: course, isLoading } = usePublicCourse(id)

  if (isLoading || !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mt-5 rounded-2xl border border-border-soft bg-surface p-8 shadow-card">
        <h1 className="font-display text-3xl font-semibold text-ink">{course.name}</h1>
        {course.description && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{course.description}</p>}

        <div className="mt-6 flex flex-wrap gap-6 border-y border-border-soft py-5">
          {course.duration && (
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Clock size={16} className="text-primary-600" /> {course.duration}
            </div>
          )}
          {course.fees != null && (
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <IndianRupee size={16} className="text-primary-600" /> <span className="num">{formatFees(course.fees)}</span>
            </div>
          )}
          {course.brochureUrl && (
            <a
              href={course.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-accent-600 hover:underline"
            >
              <FileDown size={16} /> Download brochure
            </a>
          )}
        </div>

        {Array.isArray(course.modules) && course.modules.length > 0 && (
          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><Layers size={16} /> What you'll learn</h2>
            <ul className="mt-3 space-y-2">
              {course.modules.map((m, i) => (
                <li key={m.id || i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  <span>
                    <span className="font-medium text-ink">{m.name}</span>
                    {m.description && <span className="text-ink-faint"> — {m.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Button as={Link} to={`/apply?courseId=${course.id}`} size="lg">
            Enquire Now <ArrowRight size={17} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
