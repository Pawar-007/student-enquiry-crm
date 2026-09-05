import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, IndianRupee, FileText, Layers, ChevronLeft } from 'lucide-react';
import { getPublicCourseById } from '../../api/courseApi';
import { useApi } from '../../hooks/useApi';
import { formatCurrency, formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonLine } from '../../components/ui/Skeleton';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { data: course, loading, error, refetch } = useApi(() => getPublicCourseById(courseId), [courseId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-4">
        <SkeletonLine className="w-2/3 h-8" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-5/6" />
        <SkeletonLine className="w-1/3 h-10 mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
        <ErrorState message={error.message} onRetry={refetch} />
      </div>
    );
  }

  if (!course) return null;

  const modules = course.modules || [];
  const batches = course.batches || [];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] mb-6">
        <ChevronLeft size={16} /> Back to courses
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)]">{course.courseName}</h1>
      <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">{course.description}</p>

      <div className="mt-6 flex flex-wrap gap-6 text-sm text-[var(--color-ink-soft)]">
        {course.duration && (
          <span className="inline-flex items-center gap-2"><Clock size={16} className="text-[var(--color-cobalt)]" /> {course.duration}</span>
        )}
        {course.fees !== undefined && course.fees !== null && (
          <span className="inline-flex items-center gap-2"><IndianRupee size={16} className="text-[var(--color-cobalt)]" /> {formatCurrency(course.fees)}</span>
        )}
        {course.brochurePdf && (
          <a href={course.brochurePdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--color-cobalt)] hover:underline">
            <FileText size={16} /> Download brochure
          </a>
        )}
      </div>

      <div className="mt-10">
        <Button as={Link} to="/enquiry" state={{ courseId: course.courseId, courseName: course.courseName }} size="lg" variant="primary" icon={ArrowRight}>
          Enquire About This Course
        </Button>
      </div>

      {modules.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl text-[var(--color-ink)] mb-5 flex items-center gap-2">
            <Layers size={18} className="text-[var(--color-cobalt)]" /> Course modules
          </h2>
          <ol className="flex flex-col gap-3">
            {[...modules]
              .sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0))
              .map((mod) => (
                <li key={mod.moduleId} className="flex items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <span className="shrink-0 h-8 w-8 rounded-full bg-[var(--color-cobalt-soft)] text-[var(--color-cobalt)] flex items-center justify-center text-sm font-medium">
                    {mod.moduleOrder}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--color-ink)]">{mod.moduleName}</p>
                    {mod.duration && <p className="text-sm text-[var(--color-muted)] mt-0.5">{mod.duration}</p>}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      )}

      {batches.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl text-[var(--color-ink)] mb-5">Available batches</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch.batchId} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="font-medium text-[var(--color-ink)]">{batch.batchName}</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
                </p>
                {batch.timing && <p className="text-sm text-[var(--color-muted)]">{batch.timing}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
