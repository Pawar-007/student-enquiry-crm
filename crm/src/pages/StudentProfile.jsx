import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import { useEnrollmentsByStudent } from '../features/enrollments/hooks'
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

function formatCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: enrollments, isLoading } = useEnrollmentsByStudent(id)

  return (
    <div className="max-w-3xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <div>
        <h1 className="text-xl font-bold text-ink">{enrollments?.[0]?.studentName || 'Student profile'}</h1>
        <p className="text-sm text-ink-faint mt-0.5">All enrollments for this student.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
      ) : (enrollments || []).length === 0 ? (
        <EmptyState icon={GraduationCap} title="No enrollments yet" description="Once admission is confirmed, enrollments show up here." />
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => (
            <button
              key={e.id}
              onClick={() => navigate(`/portal/enrollments/${e.id}`)}
              className="block w-full rounded-lg border border-border-soft bg-surface p-5 text-left shadow-card hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink">{e.courseName}</p>
                <span className="text-xs font-semibold text-ink-faint">{e.status}</span>
              </div>
              <div className="mt-2 flex gap-6 text-xs text-ink-soft">
                <span>Total: <span className="num font-semibold">{formatCurrency(e.totalFees)}</span></span>
                <span>Paid: <span className="num font-semibold text-primary-600">{formatCurrency(e.paidAmount)}</span></span>
                <span>Pending: <span className="num font-semibold text-hot">{formatCurrency(e.pendingAmount)}</span></span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
