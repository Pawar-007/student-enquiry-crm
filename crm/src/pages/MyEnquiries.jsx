import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListChecks } from 'lucide-react'
import { useMyEnquiries } from '../features/enquiries/hooks'
import { PriorityBadge } from '../components/Badge'
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

const COLUMNS = ['New', 'Interested', 'Demo Scheduled', 'Admission Done', 'Not Interested']

export default function MyEnquiries() {
  const { data, isLoading } = useMyEnquiries()
  const navigate = useNavigate()
  const [priorityFilter, setPriorityFilter] = useState('')

  const grouped = useMemo(() => {
    const list = (data || []).filter((e) => !priorityFilter || e.priority === priorityFilter)
    return COLUMNS.reduce((acc, status) => {
      acc[status] = list.filter((e) => e.status === status)
      return acc
    }, {})
  }, [data, priorityFilter])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">My enquiries</h1>
          <p className="text-sm text-ink-faint mt-0.5">Everything assigned to you, grouped by stage.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {['Hot', 'Warm', 'Cold'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(priorityFilter === p ? '' : p)}
              className={`transition-opacity ${priorityFilter && priorityFilter !== p ? 'opacity-40' : ''}`}
            >
              <PriorityBadge priority={p} />
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (data || []).length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No enquiries assigned yet"
          description="Walk-in enquiries you create assign to you automatically."
          action={<Button size="sm" onClick={() => navigate('/portal/enquiries/new')}>New enquiry</Button>}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {COLUMNS.map((status) => (
            <div key={status} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-ink-faint">{status}</h3>
                <span className="num text-xs text-ink-faint">{grouped[status]?.length || 0}</span>
              </div>
              <div className="space-y-2">
                {(grouped[status] || []).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => navigate(`/portal/enquiries/${e.id}`)}
                    className="w-full rounded-md border border-border-soft bg-surface p-3 text-left shadow-card hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{e.fullName}</p>
                      <PriorityBadge priority={e.priority} />
                    </div>
                    <p className="num mt-1 text-xs text-ink-faint">{e.mobileNumber}</p>
                    <p className="mt-1.5 text-xs text-ink-soft">{e.courseName || 'Course TBD'}</p>
                  </button>
                ))}
                {(grouped[status] || []).length === 0 && (
                  <div className="rounded-md border border-dashed border-border py-6 text-center text-xs text-ink-faint">
                    Nothing here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
