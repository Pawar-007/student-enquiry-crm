import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { getMyEnquiries } from '../../api/enquiryApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/FilterBar';
import EnquiryTable from '../../components/crm/EnquiryTable';
import AddEnquiryDrawer from '../../components/crm/AddEnquiryDrawer';
import { ENQUIRY_STATUS, ENQUIRY_PRIORITY } from '../../constants/enums';

export default function CounsellorEnquiries() {
  const { data: enquiries, loading, error, refetch, setData } = useApi(getMyEnquiries, []);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!enquiries) return [];
    return enquiries.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || e.fullName?.toLowerCase().includes(q) || e.mobileNumber?.includes(q);
      const matchesStatus = !filters.status || e.status === filters.status;
      const matchesPriority = !filters.priority || e.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [enquiries, search, filters]);

  return (
    <div>
      <PageHeader
        title="My Enquiries"
        description="Enquiries currently assigned to you."
        actions={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>Add Enquiry</Button>}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or mobile…"
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onClear={() => { setFilters({}); setSearch(''); }}
        filters={[
          { key: 'status', label: 'Status', options: ENQUIRY_STATUS },
          { key: 'priority', label: 'Priority', options: ENQUIRY_PRIORITY },
        ]}
      />

      <EnquiryTable
        enquiries={filtered}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath="/counsellor/enquiries"
        showCounsellor={false}
        emptyTitle="No enquiries assigned to you yet"
      />

      <AddEnquiryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={(created) => setData((prev) => (prev ? [created, ...prev] : [created]))}
      />
    </div>
  );
}
