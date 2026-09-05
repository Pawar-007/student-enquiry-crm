import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Users2, Briefcase, MessagesSquare } from 'lucide-react';
import Button from '../../components/ui/Button';

const WHY_ITEMS = [
  {
    icon: Compass,
    title: 'Courses built around outcomes',
    description: 'Every course is scoped into clear modules with real duration and fee details, so you know exactly what you\'re signing up for.',
  },
  {
    icon: Users2,
    title: 'A counsellor who actually follows through',
    description: 'From your first enquiry, one counsellor stays with you — no ping-ponging between departments to get an answer.',
  },
  {
    icon: Briefcase,
    title: 'Training aimed at hiring, not just certificates',
    description: 'Modules are sequenced the way employers expect skills to be learned, taught by practitioners with named expertise.',
  },
];

const STEPS = [
  { title: 'Explore a course', description: 'Browse modules, duration, fees and available batches before you commit to anything.' },
  { title: 'Submit an enquiry', description: 'Tell us what you\'re looking for — mode, budget, timeline — in a two-minute form.' },
  { title: 'Talk to a counsellor', description: 'We call you back to walk through the course fit, batch timing and next steps.' },
  { title: 'Enroll when ready', description: 'Confirm your batch, pay in the way that suits you, and start learning.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-[var(--color-ink)]">
            Find the course. Meet the counsellor. Start the career.
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Ledger is where prospective students explore our training programs, ask real questions,
            and get matched with a counsellor who helps them enroll in the right batch — not just any batch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/courses" size="lg" variant="primary" icon={ArrowRight}>
              Explore Courses
            </Button>
            <Button as={Link} to="/enquiry" size="lg" variant="secondary">
              Enquire Now
            </Button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-t border-[var(--color-border)]">
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] max-w-lg">Why students choose to enroll with us</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="h-10 w-10 rounded-[var(--radius-sm)] bg-[var(--color-cobalt-soft)] text-[var(--color-cobalt)] flex items-center justify-center mb-4">
                <item.icon size={20} />
              </div>
              <h3 className="font-display text-lg text-[var(--color-ink)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-t border-[var(--color-border)]">
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] max-w-lg">How it works</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative pl-0">
              <p className="font-display text-3xl text-[var(--color-cobalt)]/30 mb-3">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-medium text-[var(--color-ink)] mb-1.5">{step.title}</h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-t border-[var(--color-border)]">
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-ink)] text-white px-8 py-12 sm:px-14 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="max-w-md">
            <MessagesSquare size={22} className="text-[var(--color-amber)] mb-4" />
            <h2 className="font-display text-2xl sm:text-3xl leading-tight">Not sure which course fits? Just ask.</h2>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Submit your requirement and a counsellor will help you compare options before you decide.
            </p>
          </div>
          <Button as={Link} to="/enquiry" size="lg" variant="amber" icon={ArrowRight}>
            Submit an Enquiry
          </Button>
        </div>
      </section>
    </div>
  );
}
