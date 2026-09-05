import { useMemo } from 'react';
import { getMyEnquiries } from '../../api/enquiryApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import EnquiryTable from '../../components/crm/EnquiryTable';

export default function CounsellorAdmissions() {
  const { data: enquiries, loading, error, refetch } = useApi(getMyEnquiries, []);
  
  const admitted = useMemo(() => (enquiries || []).filter((e) => e.status === 'Admission_Done'), [enquiries]);

  return (
    <div>
      <PageHeader title="My Admissions" description="Enquiries you've successfully converted into admissions." />
      <EnquiryTable
        enquiries={admitted}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath="/counsellor/enquiries"
        showCounsellor={false}
        emptyTitle="No admissions yet"
        emptyDescription="Confirmed admissions from your enquiries will show up here."
      />
    </div>
  );
}
