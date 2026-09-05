import { getEnquiriesByStatus } from '../../api/enquiryApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import EnquiryTable from '../../components/crm/EnquiryTable';

// The backend doesn't expose a "list all enrollments" endpoint — admissions
// are enquiries that have moved to ADMISSION_DONE status, which is what we
// have an API for (GET /api/enquiries/status/{status}).
export default function AdminAdmissions() {
  const { data: enquiries, loading, error, refetch } = useApi(() => getEnquiriesByStatus('Admission_Done'), []);

  return (
    <div>
      <PageHeader title="Admissions" description="Enquiries that have completed the admission process." />
      <EnquiryTable
        enquiries={enquiries}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath="/admin/enquiries"
        emptyTitle="No admissions yet"
        emptyDescription="Confirmed admissions will appear here once counsellors close out enquiries."
      />
    </div>
  );
}
