import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Phone, Mail, MapPin, ArrowLeft, Plus, CheckCircle2, Clock, XCircle, CalendarPlus,
} from 'lucide-react'
import { useEnquiry, useUpdateEnquiryStatus, useUpdateEnquiryPriority } from '../features/enquiries/hooks'
import { useFollowupsByEnquiry, useCreateFollowup } from '../features/followups/hooks'
import { useConfirmAdmission } from '../features/enrollments/hooks'
import { useCourses } from '../features/courses/hooks'
import { useBatchesByCourse } from '../features/batches/hooks'
import { useCurrentUser } from '../hooks/useAuth'
import { StatusBadge, PriorityBadge, FollowupStatusBadge } from '../components/Badge'
import { CardSkeleton } from '../components/Skeleton'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Input, Select, Textarea, FieldError } from '../components/Field'

const STATUSES = ['New', 'Interested', 'Demo Scheduled', 'Admission Done', 'Not Interested']
const PRIORITIES = ['Hot', 'Warm', 'Cold']
const TYPES = ['Call', 'WhatsApp', 'Email', 'Walk-in', 'Other']

function ScheduleFollowupModal({ enquiryId, open, onClose }) {
  const create = useCreateFollowup()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { interactionType: 'Call', scheduledAt: '', remarks: '', nextFollowupAt: '' },
  })

  function onSubmit(values) {
    create.mutate({ ...values, enquiryId }, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule follow-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="interactionType">Type</Label>
            <Select id="interactionType" {...register('interactionType')}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledAt">Scheduled for</Label>
            <Input id="scheduledAt" type="date" {...register('scheduledAt', { required: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor="nextFollowupAt">Next follow-up (optional)</Label>
          <Input id="nextFollowupAt" type="date" {...register('nextFollowupAt')} />
        </div>
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea id="remarks" rows={3} {...register('remarks')} placeholder="Anything the next call should know" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Schedule</Button>
        </div>
      </form>
    </Modal>
  )
}

function ConfirmAdmissionModal({ enquiry, open, onClose }) {
  const navigate = useNavigate()
  const confirmAdmission = useConfirmAdmission()
  const { data: batches } = useBatchesByCourse(enquiry?.courseId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { totalFees: '', batchId: '' } })

  function onSubmit(values) {
    confirmAdmission.mutate(
      { enquiryId: enquiry.id, courseId: enquiry.courseId, totalFees: Number(values.totalFees), batchId: values.batchId },
      {
        onSuccess: (enrollment) => {
          onClose()
          navigate(`/portal/enrollments/${enrollment.id}`)
        },
      }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm admission" width="lg">
      <div className="mb-4 rounded-md bg-primary-50 px-3 py-2.5 text-sm text-primary-700">
        This converts <strong>{enquiry?.fullName}</strong> into a student with an active enrollment for{' '}
        <strong>{enquiry?.courseName}</strong>.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="totalFees">Total fees (₹)</Label>
          <Input id="totalFees" type="number" min="0" step="1" {...register('totalFees', { required: true, min: 1 })} />
          <FieldError>{errors.totalFees && 'Enter the total course fee'}</FieldError>
        </div>
        <div>
          <Label htmlFor="batchId">Batch</Label>
          <Select id="batchId" {...register('batchId', { required: true })}>
            <option value="">Select a batch</option>
            {(batches || []).map((b) => <option key={b.id} value={b.id}>{b.name || b.batchName}</option>)}
          </Select>
          <FieldError>{errors.batchId && 'Select a batch for this student'}</FieldError>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={confirmAdmission.isPending}>Confirm admission</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function EnquiryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const { data: enquiry, isLoading } = useEnquiry(id)
  const { data: followups, isLoading: followupsLoading } = useFollowupsByEnquiry(id)
  const updateStatus = useUpdateEnquiryStatus()
  const updatePriority = useUpdateEnquiryPriority()
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [admissionOpen, setAdmissionOpen] = useState(false)

  if (isLoading || !enquiry) {
    return (
      <div className="space-y-4 max-w-3xl">
        <CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  const eligibleForAdmission = ['Interested', 'Demo Scheduled'].includes(enquiry.status)

  return (
    <div className="max-w-3xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-ink">{enquiry.fullName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5 num"><Phone size={14} /> {enquiry.mobileNumber}</span>
              {enquiry.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {enquiry.email}</span>}
              {enquiry.city && <span className="flex items-center gap-1.5"><MapPin size={14} /> {enquiry.city}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={enquiry.status} />
            <PriorityBadge priority={enquiry.priority} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border-soft pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-faint">Course</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{enquiry.courseName || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-faint">Mode</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{enquiry.courseMode || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-faint">Budget</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{enquiry.budgetRange || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-faint">Source</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{enquiry.enquirySource}</p>
          </div>
          {user?.role === 'Admin' && (
            <div>
              <p className="text-xs font-semibold uppercase text-ink-faint">Counsellor</p>
              <p className="mt-0.5 text-sm font-medium text-ink">{enquiry.counsellorName || 'Unassigned'}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-soft pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-faint">Status</span>
            <Select
              className="w-auto"
              value={enquiry.status}
              onChange={(e) => updateStatus.mutate({ id: enquiry.id, status: e.target.value })}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-faint">Priority</span>
            <Select
              className="w-auto"
              value={enquiry.priority}
              onChange={(e) => updatePriority.mutate({ id: enquiry.id, priority: e.target.value })}
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setScheduleOpen(true)}>
              <CalendarPlus size={15} className="mr-1.5" /> Schedule follow-up
            </Button>
            {eligibleForAdmission && (
              <Button size="sm" onClick={() => setAdmissionOpen(true)}>
                <CheckCircle2 size={15} className="mr-1.5" /> Confirm admission
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Follow-up timeline</h2>
          <Button size="sm" variant="ghost" onClick={() => setScheduleOpen(true)}>
            <Plus size={15} className="mr-1" /> Add
          </Button>
        </div>

        {followupsLoading ? (
          <div className="mt-4 space-y-3">
            <CardSkeleton /><CardSkeleton />
          </div>
        ) : (followups || []).length === 0 ? (
          <p className="mt-4 text-sm text-ink-faint">No follow-ups logged yet for this enquiry.</p>
        ) : (
          <ol className="mt-4 space-y-4 border-l-2 border-border-soft pl-4">
            {(followups || []).map((f) => (
              <li key={f.id} className="relative">
                <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary-500 ring-4 ring-surface" />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{f.interactionType}</p>
                  <FollowupStatusBadge status={f.status} />
                  <span className="num text-xs text-ink-faint">{f.scheduledAt}</span>
                </div>
                {f.outcome && <p className="mt-0.5 text-xs font-medium text-primary-600">Outcome: {f.outcome}</p>}
                {f.remarks && <p className="mt-1 text-sm text-ink-soft">{f.remarks}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>

      <ScheduleFollowupModal enquiryId={enquiry.id} open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <ConfirmAdmissionModal enquiry={enquiry} open={admissionOpen} onClose={() => setAdmissionOpen(false)} />
    </div>
  )
}
