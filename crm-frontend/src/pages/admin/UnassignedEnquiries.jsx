import { useEffect, useState } from 'react';
import { getUnassignedEnquiries, assignEnquiryCounsellor } from '../../api/enquiryApi';
import { getActiveCounsellors } from '../../api/userApi';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { Select } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/format';

export default function UnassignedEnquiries() {
  const { data: enquiries, loading, error, refetch, setData } = useApi(getUnassignedEnquiries, []);
  const [counsellors, setCounsellors] = useState([]);
  const [selection, setSelection] = useState({});
  const [assigningId, setAssigningId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    getActiveCounsellors().then(setCounsellors).catch(() => setCounsellors([]));
  }, []);

  const counsellorOptions = counsellors.map((c) => ({ value: String(c.userId), label: c.name }));

  const handleAssign = async (enquiryId) => {
    const counsellorId = selection[enquiryId];
    if (!counsellorId) {
      toast.error('Select a counsellor before assigning.');
      return;
    }
    setAssigningId(enquiryId);
    try {
      await assignEnquiryCounsellor(enquiryId, counsellorId);
      toast.success('Enquiry assigned successfully');
      setData((prev) => prev.filter((e) => e.enquiryId !== enquiryId));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigningId(null);
    }
  };

  const columns = [
    { key: 'fullName', header: 'Student', render: (r) => <span className="font-medium">{r.fullName}</span> },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'courseName', header: 'Course', render: (r) => r.course?.courseName || r.courseName || '—' },
    { key: 'enquirySource', header: 'Source' },
    { key: 'createdAt', header: 'Created', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Unassigned Enquiries" description="Enquiries waiting for a counsellor to be assigned." />
      <DataTable
        columns={columns}
        rows={enquiries}
        keyField="enquiryId"
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle="No unassigned enquiries"
        emptyDescription="Every enquiry currently has a counsellor assigned. Nice work."
        rowActions={(row) => (
          <div className="flex items-center gap-2 justify-end">
            <div className="w-40">
              <Select
                aria-label="Select counsellor"
                placeholder="Counsellor"
                value={selection[row.enquiryId] || ''}
                onChange={(e) => setSelection((s) => ({ ...s, [row.enquiryId]: e.target.value }))}
                options={counsellorOptions}
              />
            </div>
            <Button size="sm" variant="primary" loading={assigningId === row.enquiryId} onClick={() => handleAssign(row.enquiryId)}>
              Assign
            </Button>
          </div>
        )}
      />
    </div>
  );
}
