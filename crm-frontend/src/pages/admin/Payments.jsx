import { useState } from 'react';
import { Wallet, Plus, Search } from 'lucide-react';
import { getEnrollmentById } from '../../api/enrollmentApi';
import { getPaymentsByEnrollment, createPayment } from '../../api/paymentApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import { Input, Select, Textarea } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import EmptyState from '../../components/ui/EmptyState';
import { PAYMENT_METHODS } from '../../constants/enums';
import { formatCurrency, formatDateTime } from '../../utils/format';

const emptyForm = { amount: '', paymentMethod: '', transactionReference: '', remarks: '' };

export default function Payments() {
  const toast = useToast();
  const [enrollmentIdInput, setEnrollmentIdInput] = useState('');
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!enrollmentIdInput) return;
    setLoading(true);
    setNotFound(false);
    try {
      const [enr, pays] = await Promise.all([
        getEnrollmentById(enrollmentIdInput),
        getPaymentsByEnrollment(enrollmentIdInput),
      ]);
      setEnrollment(enr);
      setPayments(pays);
      setEnrollmentId(enrollmentIdInput);
    } catch (err) {
      setNotFound(true);
      setEnrollment(null);
      setPayments(null);
      toast.error(err.message || 'Enrollment not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!form.amount || !form.paymentMethod) {
      toast.error('Amount and payment method are required.');
      return;
    }
    setSubmitting(true);
    try {
      const payment = await createPayment({
        enrollmentId: Number(enrollmentId),
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        transactionReference: form.transactionReference || undefined,
        remarks: form.remarks || undefined,
      });
      toast.success('Payment recorded successfully');
      setPayments((prev) => (prev ? [payment, ...prev] : [payment]));
      setForm(emptyForm);
      const refreshed = await getEnrollmentById(enrollmentId).catch(() => null);
      if (refreshed) setEnrollment(refreshed);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'paymentId', header: 'ID' },
    { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
    { key: 'paymentMethod', header: 'Method' },
    { key: 'transactionReference', header: 'Reference', render: (r) => r.transactionReference || '—' },
    { key: 'paymentDate', header: 'Date', render: (r) => formatDateTime(r.paymentDate) },
  ];

  return (
    <div>
      <PageHeader title="Payments" description="Look up an enrollment to view its payment history and record new payments." />

      <form onSubmit={handleLookup} className="flex items-end gap-3 mb-8 max-w-md">
        <div className="flex-1">
          <Input id="enrollmentLookup" label="Enrollment ID" value={enrollmentIdInput} onChange={(e) => setEnrollmentIdInput(e.target.value)} placeholder="e.g. 104" />
        </div>
        <Button type="submit" icon={Search} loading={loading}>Lookup</Button>
      </form>

      {notFound && (
        <EmptyState icon={Wallet} title="Enrollment not found" description="Double-check the enrollment ID and try again." />
      )}

      {enrollment && (
        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 grid sm:grid-cols-4 gap-4">
            <Info label="Student" value={enrollment.student?.fullName} />
            <Info label="Course" value={enrollment.course?.courseName} />
            <Info label="Total Fees" value={formatCurrency(enrollment.totalFees)} />
            <Info label="Pending" value={formatCurrency(enrollment.pendingAmount)} />
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-4">Record Payment</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input id="amount" label="Amount" type="number" min="0" required value={form.amount} onChange={setField('amount')} />
              <Select id="paymentMethod" label="Payment Method" required value={form.paymentMethod} onChange={setField('paymentMethod')} options={PAYMENT_METHODS} />
              <Input id="transactionReference" label="Transaction Reference" value={form.transactionReference} onChange={setField('transactionReference')} />
              <Textarea id="remarks" label="Remarks" value={form.remarks} onChange={setField('remarks')} />
            </div>
            <Button icon={Plus} className="mt-4" loading={submitting} onClick={handleRecordPayment}>Record Payment</Button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">Payment History</p>
            <DataTable columns={columns} rows={payments} keyField="paymentId" emptyTitle="No payments recorded yet" />
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="text-sm font-medium text-[var(--color-ink)] mt-0.5">{value ?? '—'}</p>
    </div>
  );
}
