import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, TrendingUp, BookOpen, Star } from 'lucide-react'
import { usePublicCourses } from '../../features/public/hooks'
import Button from '../../components/Button'
import { CardSkeleton } from '../../components/Skeleton'

const STATS = [
  { icon: Users, value: '500+', label: 'Students placed' },
  { icon: Award, value: '12+', label: 'Years of teaching' },
  { icon: TrendingUp, value: '92%', label: 'Course completion rate' },
]

const ACCENTS = ['bg-primary-500', 'bg-accent-500', 'bg-warm', 'bg-cold']

function formatFees(n) {
  if (n == null) return null
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function Landing() {
  const { data: courses, isLoading } = usePublicCourses()
  const featured = (courses || []).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-56 w-56 rounded-full bg-accent-50 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                <Star size={12} fill="currentColor" /> Admissions open for 2026
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink lg:text-5xl">
                Find the course that gets you where you're going.
              </h1>
              <p className="mt-5 max-w-md text-base text-ink-soft">
                Practical, instructor-led programs with small batches, flexible online or offline modes, and a
                counsellor who actually follows up — not just a brochure.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button as={Link} to="/apply" size="lg">
                  Apply Now <ArrowRight size={17} className="ml-2" />
                </Button>
                <Button as={Link} to="/courses" size="lg" variant="secondary">
                  Browse courses
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-pop">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center sm:text-left">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 sm:mx-0">
                        <s.icon size={18} />
                      </div>
                      <p className="num mt-3 text-2xl font-bold text-ink">{s.value}</p>
                      <p className="text-xs text-ink-faint">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-border-soft bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Why students choose us</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: 'Real counsellors, real follow-up', body: 'Every enquiry gets a dedicated counsellor who checks in until you have what you need to decide.' },
              { title: 'Small, focused batches', body: 'Online or offline, our batches stay small enough that instructors know your name.' },
              { title: 'Transparent fees', body: 'No hidden costs. You see the full fee breakdown before you commit to anything.' },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-border-soft p-5">
                <p className="text-sm font-bold text-ink">{f.title}</p>
                <p className="mt-2 text-sm text-ink-faint">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Featured courses</h2>
            <p className="mt-1 text-sm text-ink-faint">A few of our most popular programs.</p>
          </div>
          <Link to="/courses" className="hidden text-sm font-semibold text-primary-600 hover:underline sm:block">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <p className="mt-6 text-sm text-ink-faint">Course listings are coming soon — check back shortly.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c, i) => (
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
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link to="/courses" className="mt-6 block text-sm font-semibold text-primary-600 hover:underline sm:hidden">
          View all courses →
        </Link>
      </section>

      {/* Testimonials placeholder */}
      <section className="border-t border-border-soft bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">What our students say</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-paper p-5">
                <div className="flex gap-0.5 text-warm">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  "Testimonial coming soon — this space will feature real student stories."
                </p>
                <p className="mt-3 text-xs font-semibold text-ink-faint">Student Name, Batch {2024 + i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl bg-primary-500 px-8 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-white lg:text-3xl">
            Ready to take the next step?
          </h2>
          <p className="mt-2 text-sm text-primary-50">Tell us a bit about yourself — a counsellor will reach out within 24 hours.</p>
          <Button as={Link} to="/apply" size="lg" variant="secondary" className="mt-6 bg-white text-primary-700 hover:bg-primary-50">
            Apply Now <ArrowRight size={17} className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
