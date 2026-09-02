import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen } from 'lucide-react'
import { useCourses, useCourseSearch } from '../features/courses/hooks'
import { Input } from '../components/Field'
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function Courses() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const allCourses = useCourses()
  const searchResults = useCourseSearch(query)

  const isSearching = query.trim().length > 0
  const { data, isLoading } = isSearching ? searchResults : allCourses
  const courses = data || []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Course catalog</h1>
        <p className="text-sm text-ink-faint mt-0.5">Browse every course on offer.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input placeholder="Search courses" className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/portal/courses/${c.id}`)}
              className="rounded-lg border border-border-soft bg-surface p-5 text-left shadow-card hover:border-primary-500 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <BookOpen size={17} />
              </div>
              <p className="mt-3 text-sm font-bold text-ink">{c.name}</p>
              {c.description && <p className="mt-1 text-xs text-ink-faint line-clamp-2">{c.description}</p>}
              {c.duration && <p className="mt-2 text-xs font-medium text-ink-soft">{c.duration}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
