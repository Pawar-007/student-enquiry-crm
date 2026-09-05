import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getTodaysFollowups } from '../../api/followupApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { CompleteFollowupModal } from '../admin/AdminFollowups';
import { FOLLOWUP_STATUS } from '../../constants/enums';
import { formatDate, formatDateTime } from '../../utils/format';

export default function CounsellorFollowups() {
  const { data: followups, loading, error, refetch, setData } = useApi(getTodaysFollowups, []);
  const [target, setTarget] = useState(null);

  const columns = [
    { key: 'enquiry', header: 'Student', render: (r) => r.enquiry?.fullName || '—' },
    { key: 'mobile', header: 'Mobile', render: (r) => r.enquiry?.mobileNumber || '—' },
    { key: 'interactionType', header: 'Type' },
    { key: 'scheduledAt', header: 'Scheduled', render: (r) => formatDate(r.scheduledAt) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge list={FOLLOWUP_STATUS} value={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Today's & Upcoming Follow-ups" description="Follow-ups scheduled for you today." />
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
