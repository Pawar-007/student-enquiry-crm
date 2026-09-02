import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, IndianRupee, Receipt } from 'lucide-react'
import { useEnrollment } from '../features/enrollments/hooks'
import { usePaymentsByEnrollment, useAddPayment } from '../features/payments/hooks'
import { Table, THead, Th, Td, Tr } from '../components/Table'
import { CardSkeleton, TableSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Input, Select, FieldError } from '../components/Field'

const METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other']

function formatCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function AddPaymentModal({ enrollmentId, pendingAmount, open, onClose }) {
  const addPayment = useAddPayment()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function onSubmit(values) {
    addPayment.mutate(
      { ...values, enrollmentId, amount: Number(values.amount) },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Add payment">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input id="amount" type="number" min="1" step="1" {...register('amount', { required: true, min: 1 })} />
          <FieldError>{errors.amount && 'Enter a valid amount'}</FieldError>
          {pendingAmount != null && (
            <p className="mt-1 text-xs text-ink-faint">Pending: <span className="num">{formatCurrency(pendingAmount)}</span></p>
          )}
        </div>
        <div>
          <Label htmlFor="paymentMethod">Method</Label>
          <Select id="paymentMethod" {...register('paymentMethod', { required: true })}>
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="transactionReference">Transaction reference (optional)</Label>
          <Input id="transactionReference" {...register('transactionReference')} />
        </div>
        <div>
          <Label htmlFor="remarks">Remarks (optional)</Label>
          <Input id="remarks" {...register('remarks')} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={addPayment.isPending}>Record payment</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function EnrollmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: enrollment, isLoading } = useEnrollment(id)
  const { data: payments, isLoading: paymentsLoading } = usePaymentsByEnrollment(id)
  const [open, setOpen] = useState(false)

  if (isLoading || !enrollment) {
    return <div className="max-w-3xl space-y-4"><CardSkeleton /><CardSkeleton /></div>
  }

  const total = enrollment.totalFees || 0
  const paid = enrollment.paidAmount || 0
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0

  return (
    <div className="max-w-3xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-ink">{enrollment.courseName}</h1>
            <p className="text-sm text-ink-faint mt-0.5">{enrollment.studentName}</p>
          </div>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">{enrollment.status}</span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-faint">
            <span>{formatCurrency(paid)} paid</span>
            <span>{formatCurrency(total)} total</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border-soft">
            <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-xs font-medium text-hot">{formatCurrency(enrollment.pendingAmount)} pending</p>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus size={15} className="mr-1.5" /> Add payment
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><Receipt size={16} /> Payment history</h2>
        {paymentsLoading ? (
          <div className="mt-3"><TableSkeleton rows={3} cols={4} /></div>
        ) : (payments || []).length === 0 ? (
          <div className="mt-3">
            <EmptyState icon={IndianRupee} title="No payments recorded yet" description="Add the first payment to start the ledger." />
          </div>
        ) : (
          <div className="mt-3">
            <Table>
              <THead>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
              </THead>
              <tbody>
                {payments.map((p) => (
                  <Tr key={p.id}>
                    <Td className="num text-ink-soft">{p.paidAt || p.createdAt}</Td>
                    <Td className="num font-semibold">{formatCurrency(p.amount)}</Td>
                    <Td>{p.paymentMethod}</Td>
                    <Td className="text-ink-soft">{p.transactionReference || '—'}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <AddPaymentModal enrollmentId={id} pendingAmount={enrollment.pendingAmount} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
