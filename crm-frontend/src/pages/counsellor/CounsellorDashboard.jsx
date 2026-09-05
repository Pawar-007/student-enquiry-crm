import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, CalendarClock, Clock, Flame, GraduationCap, Plus } from 'lucide-react';
import { getMyEnquiries } from '../../api/enquiryApi';
import { getTodaysFollowups } from '../../api/followupApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import { SkeletonStat } from '../../components/ui/Skeleton';
import AddEnquiryDrawer from '../../components/crm/AddEnquiryDrawer';

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: enquiries, loading: loadingEnquiries } = useApi(getMyEnquiries, []);
  const { data: followups, loading: loadingFollowups } = useApi(getTodaysFollowups, []);

  const stats = useMemo(() => {
    const list = enquiries || [];
    return {
      total: list.length,
      pending: list.filter((e) => !['Admission_Done', 'Not_Interested'].includes(e.status)).length,
      highPriority: list.filter((e) => e.priority === 'Hot').length,
      admissions: list.filter((e) => e.status === 'Admission_Done').length,
    };
  }, [enquiries]);

  const loading = loadingEnquiries || loadingFollowups;

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        description="Your enquiries, today's follow-ups, and admissions at a glance."
        actions={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>Add Enquiry</Button>}
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStat key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="My Enquiries" value={stats.total} icon={Inbox} tone="cobalt" />
          <StatCard label="Pending Leads" value={stats.pending} icon={Clock} tone="amber" />
          <StatCard label="High Priority" value={stats.highPriority} icon={Flame} tone="danger" />
          <StatCard label="Today's Follow-ups" value={followups?.length ?? 0} icon={CalendarClock} tone="neutral" />
          <StatCard label="Admissions" value={stats.admissions} icon={GraduationCap} tone="success" />
        </div>
      )}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon={Plus} onClick={() => setDrawerOpen(true)}>Add Enquiry</Button>
          <Button variant="secondary" icon={Inbox} onClick={() => navigate('/counsellor/enquiries')}>View My Enquiries</Button>
          <Button variant="secondary" icon={CalendarClock} onClick={() => navigate('/counsellor/followups')}>Today's Follow-ups</Button>
        </div>
      </div>

      <AddEnquiryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={() => navigate('/counsellor/enquiries')} />
    </div>
  );
}
