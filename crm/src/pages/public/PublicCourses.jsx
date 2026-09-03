import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, ArrowRight } from 'lucide-react'
import { usePublicCourses } from '../../features/public/hooks'
import { Input } from '../../components/Field'
import { CardSkeleton } from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'

const ACCENTS = ['bg-primary-500', 'bg-accent-500', 'bg-warm', 'bg-cold']

function formatFees(n) {
  if (n == null) return null
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function PublicCourses() {
  const { data, isLoading } = usePublicCourses()
  const [query, setQuery] = useState('')

  const courses = useMemo(() => {
    const list = data || []
    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter((c) => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-semibold text-ink">Explore our courses</h1>
        <p className="mt-2 text-sm text-ink-faint">
          Find a program that fits your schedule, your budget, and where you want to go next.
        </p>
      </div>

      <div className="relative mt-8 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input placeholder="Search courses" className="pl-9 py-2.5" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={BookOpen} title="No courses found" description="Try a different search term." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="group overflow-hidden rounded-lg border border-border-soft bg-surface shadow-card transition-shadow hover:shadow-pop"
            >
              <div className={`h-1.5 w-full ${ACCENTS[i % ACCENTS.length]}`} />
              <div className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  <BookOpen size={16} />
                </div>
                <p className="mt-3 text-sm font-bold text-ink group-hover:text-primary-600">{c.name}</p>
                {c.description && <p className="mt-1 text-xs text-ink-faint line-clamp-2">{c.description}</p>}
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-soft">
                  <span>{c.duration || ''}</span>
                  {c.fees != null && <span className="num text-primary-600">{formatFees(c.fees)}</span>}
                </div>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                  View details <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
