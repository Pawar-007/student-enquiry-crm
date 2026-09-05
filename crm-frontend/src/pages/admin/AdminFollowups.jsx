import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getTodaysFollowups, completeFollowup } from '../../api/followupApi';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Select, Textarea } from '../../components/ui/FormField';
import { FOLLOWUP_STATUS, FOLLOWUP_OUTCOMES } from '../../constants/enums';
import { formatDate, formatDateTime } from '../../utils/format';

export default function AdminFollowups() {
  const { data: followups, loading, error, refetch, setData } = useApi(getTodaysFollowups, []);
  const [target, setTarget] = useState(null);

  const columns = [
    { key: 'enquiry', header: 'Student', render: (r) => r.enquiry?.fullName || '—' },
    { key: 'mobile', header: 'Mobile', render: (r) => r.enquiry?.mobileNumber || '—' },
    { key: 'interactionType', header: 'Type' },
    { key: 'scheduledAt', header: 'Scheduled', render: (r) => formatDate(r.scheduledAt) },
    { key: 'counsellor', header: 'Counsellor', render: (r) => r.counsellor?.name || '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge list={FOLLOWUP_STATUS} value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Today's Follow-ups" description="All follow-ups scheduled for today across every counsellor." />
      <DataTable
        columns={columns}
        rows={followups}
        keyField="followupId"
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle="No follow-ups scheduled for today"
        rowActions={(row) =>
          row.status === 'SCHEDULED' ? (
            <Button size="sm" variant="secondary" icon={CheckCircle2} onClick={() => setTarget(row)}>
              Complete
            </Button>
          ) : (
            <span className="text-xs text-[var(--color-muted)]">{formatDateTime(row.completedAt)}</span>
          )
        }
      />
      <CompleteFollowupModal
        followup={target}
        onClose={() => setTarget(null)}
        onCompleted={(updated) => {
          setData((prev) => prev.map((f) => (f.followupId === updated.followupId ? updated : f)));
          setTarget(null);
        }}
      />
    </div>
  );
}

export function CompleteFollowupModal({ followup, onClose, onCompleted }) {
  const toast = useToast();
  const [outcome, setOutcome] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!outcome) {
      toast.error('Select an outcome.');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await completeFollowup(followup.followupId, { outcome, remarks });
      toast.success('Follow-up completed');
      onCompleted?.(updated || { ...followup, status: 'COMPLETED', outcome, remarks });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
      setOutcome('');
      setRemarks('');
    }
  };

  return (
    <Modal
      open={Boolean(followup)}
      onClose={onClose}
      title="Complete Follow-up"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Mark Completed</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select id="outcome" label="Outcome" required value={outcome} onChange={(e) => setOutcome(e.target.value)} options={FOLLOWUP_OUTCOMES} />
        <Textarea id="completeRemarks" label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </div>
    </Modal>
  );
}
