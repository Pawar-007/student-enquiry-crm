import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2, PartyPopper, Phone, MessageCircle, Mail, Users, MoreHorizontal } from 'lucide-react'
import { useTodayFollowups, useCompleteFollowup } from '../features/followups/hooks'
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Select, Textarea } from '../components/Field'

const TYPE_ICON = { Call: Phone, WhatsApp: MessageCircle, Email: Mail, 'Walk-in': Users, Other: MoreHorizontal }
const OUTCOMES = ['Interested', 'Not Interested', 'No Response', 'Call Back Later', 'Demo Scheduled', 'Other']

function CompleteModal({ followup, onClose }) {
  const [outcome, setOutcome] = useState('Interested')
  const [remarks, setRemarks] = useState('')
  const complete = useCompleteFollowup()

  function handleSubmit(e) {
    e.preventDefault()
    complete.mutate(
      { id: followup.id, outcome, remarks },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal open={!!followup} onClose={onClose} title={`Complete follow-up · ${followup?.enquiryName || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="outcome">Outcome</Label>
          <Select id="outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea id="remarks" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="What happened on the call?" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={complete.isPending}>Mark completed</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function TodayFollowups() {
  const { data, isLoading } = useTodayFollowups()
  const navigate = useNavigate()
  const [active, setActive] = useState(null)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Today's follow-ups</h1>
        <p className="text-sm text-ink-faint mt-0.5">Everything due today, one card at a time.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (data || []).length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="No follow-ups today — you're all caught up"
          description="New follow-ups you schedule will show up here on their due date."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((f) => {
            const Icon = TYPE_ICON[f.interactionType] || CalendarCheck2
            return (
              <div key={f.id} className="rounded-lg border border-border-soft bg-surface p-4 shadow-card flex flex-col">
                <div className="flex items-center gap-2 text-primary-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50">
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{f.interactionType}</span>
                </div>
                <button
                  onClick={() => navigate(`/portal/enquiries/${f.enquiryId}`)}
                  className="mt-3 text-left text-sm font-bold text-ink hover:text-primary-600"
                >
                  {f.enquiryName || 'Enquiry'}
                </button>
                <p className="num mt-0.5 text-xs text-ink-faint">{f.mobileNumber}</p>
                {f.remarks && <p className="mt-2 text-xs text-ink-soft line-clamp-2">{f.remarks}</p>}
                <div className="mt-auto pt-3">
                  <Button size="sm" className="w-full" onClick={() => setActive(f)}>Mark completed</Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CompleteModal followup={active} onClose={() => setActive(null)} />
    </div>
  )
}
