import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, Clock, IndianRupee } from 'lucide-react';
import { getPublicCourses } from '../../api/courseApi';
import { useApi } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/format';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export default function Courses() {
  const { data: courses, loading, error, refetch } = useApi(getPublicCourses, []);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!courses) return [];
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) => c.courseName?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }, [courses, search]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="max-w-xl mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)]">Courses</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Browse our current programs — every listing shows duration, fees and what you'll actually learn.
        </p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          aria-label="Search courses"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]/30"
        />
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && <ErrorState message={error.message} onRetry={refetch} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={BookOpen} title="No courses available" description="Check back soon — new programs are added regularly." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.courseId}
              to={`/courses/${course.courseId}`}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col hover:border-[var(--color-cobalt)]/40 hover:shadow-md transition-all"
            >
              <h3 className="font-display text-lg text-[var(--color-ink)] mb-2">{course.courseName}</h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-3 flex-1">{course.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-muted)]">
                {course.duration && (
                  <span className="inline-flex items-center gap-1"><Clock size={13} /> {course.duration}</span>
                )}
                {course.fees !== undefined && course.fees !== null && (
                  <span className="inline-flex items-center gap-1"><IndianRupee size={13} /> {formatCurrency(course.fees)}</span>
                )}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-cobalt)]">
                View details <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
