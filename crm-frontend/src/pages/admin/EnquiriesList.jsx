import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { getAllEnquiries } from '../../api/enquiryApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import FilterBar from '../../components/ui/FilterBar';
import EnquiryTable from '../../components/crm/EnquiryTable';
import AddEnquiryDrawer from '../../components/crm/AddEnquiryDrawer';
import { ENQUIRY_STATUS, ENQUIRY_PRIORITY, ENQUIRY_SOURCES, COURSE_MODES } from '../../constants/enums';

export default function EnquiriesList() {
  const { data: enquiries, loading, error, refetch, setData } = useApi(getAllEnquiries, []);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!enquiries) return [];
    return enquiries.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || e.fullName?.toLowerCase().includes(q) || e.mobileNumber?.includes(q) || e.email?.toLowerCase().includes(q);
      const matchesStatus = !filters.status || e.status === filters.status;
      const matchesPriority = !filters.priority || e.priority === filters.priority;
      const matchesSource = !filters.enquirySource || e.enquirySource === filters.enquirySource;
      const matchesMode = !filters.courseMode || e.courseMode === filters.courseMode;
      return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesMode;
    });
  }, [enquiries, search, filters]);

  return (
    <div>
      <PageHeader
        title="All Enquiries"
        description="Every enquiry captured across public submissions and manual entry."
        actions={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>Add Enquiry</Button>}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, mobile or email…"
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onClear={() => { setFilters({}); setSearch(''); }}
        filters={[
          { key: 'status', label: 'Status', options: ENQUIRY_STATUS },
          { key: 'priority', label: 'Priority', options: ENQUIRY_PRIORITY },
          { key: 'enquirySource', label: 'Source', options: ENQUIRY_SOURCES },
          { key: 'courseMode', label: 'Mode', options: COURSE_MODES },
        ]}
      />

      <EnquiryTable
        enquiries={filtered}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath="/admin/enquiries"
      />

      <AddEnquiryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={(created) => setData((prev) => (prev ? [created, ...prev] : [created]))}
      />
    </div>
  );
}
