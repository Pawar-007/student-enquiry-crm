import { useNavigate } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';
import { ENQUIRY_STATUS, ENQUIRY_PRIORITY } from '../../constants/enums';
import { formatDate } from '../../utils/format';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import { Eye } from 'lucide-react';

// Reused across All Enquiries, Unassigned, My Enquiries (counsellor) — the
// column set is the same; only the base path for row navigation differs.
export default function EnquiryTable({ enquiries, loading, error, onRetry, basePath, showCounsellor = true, emptyTitle, emptyDescription }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'fullName', header: 'Student', render: (r) => <span className="font-medium">{r.fullName}</span> },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'email', header: 'Email' },
    { key: 'courseName', header: 'Course', render: (r) => r.course?.courseName || r.courseName || '—' },
    { key: 'courseMode', header: 'Mode' },
    { key: 'enquirySource', header: 'Source' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge list={ENQUIRY_STATUS} value={r.status} /> },
    { key: 'priority', header: 'Priority', render: (r) => <StatusBadge list={ENQUIRY_PRIORITY} value={r.priority} /> },
    ...(showCounsellor
      ? [{ key: 'counsellor', header: 'Counsellor', render: (r) => r.counsellor?.name || <span className="text-[var(--color-muted)]">Unassigned</span> }]
      : []),
    { key: 'createdAt', header: 'Created', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <DataTable
      columns={columns}
      rows={enquiries}
      keyField="enquiryId"
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle={emptyTitle || 'No enquiries found'}
      emptyDescription={emptyDescription}
      rowActions={(row) => (
        <Button size="sm" variant="ghost" icon={Eye} onClick={() => navigate(`${basePath}/${row.enquiryId}`)}>
          View
        </Button>
      )}
    />
  );
}
