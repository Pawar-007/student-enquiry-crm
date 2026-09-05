import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, UserCheck, Inbox, Sunrise, GraduationCap, XCircle, Wallet } from 'lucide-react';
import { getAdminDashboard } from '../../api/dashboardApi';
import { useApi } from '../../hooks/useApi';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { SkeletonStat } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency } from '../../utils/format';
import { BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useApi(getAdminDashboard, []);
  console.log(data);
  return (
    <div>
      <PageHeader title="Dashboard" description="A live snapshot of enquiries, counsellor performance and revenue." />

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 7 }).map((_, i) => <SkeletonStat key={i} />)}
        </div>
      )}

      {error && !loading && <ErrorState message={error.message} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Students" value={data.totalStudents ?? 0} icon={Users} tone="cobalt" />
            <StatCard label="Total Enquiries" value={data.totalEnquiries ?? 0} icon={Inbox} tone="cobalt" />
            <StatCard label="Today's Enquiries" value={data.todaysEnquiries ?? 0} icon={Sunrise} tone="amber" />
            <StatCard label="Active Counsellors" value={`${data.activeCounsellors ?? 0} / ${data.totalCounsellors ?? 0}`} icon={UserCheck} tone="neutral" />
            <StatCard label="Admissions Done" value={data.admissionsDoneCount ?? 0} icon={GraduationCap} tone="success" />
            <StatCard label="Not Interested" value={data.notInterestedCount ?? 0} icon={XCircle} tone="danger" />
            <StatCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={Wallet} tone="success" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="font-display text-base text-[var(--color-ink)] mb-4">Enquiries by Source</h3>
              {data.enquiriesBySource?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.enquiriesBySource} margin={{ left: -20 }}>
                    <CartesianGrid vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="source" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'var(--color-border-soft)' }} contentStyle={{ borderRadius: 8, borderColor: 'var(--color-border)', fontSize: 13 }} />
                    <Bar dataKey="count" fill="var(--color-cobalt)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={BarChart3} title="No source data yet" description="Enquiry source breakdown will appear here once enquiries come in." />
              )}
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="font-display text-base text-[var(--color-ink)] mb-4">Counsellor Conversion Performance</h3>
              {data.conversionsByCounsellor?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.conversionsByCounsellor} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="counsellorName" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip cursor={{ fill: 'var(--color-border-soft)' }} contentStyle={{ borderRadius: 8, borderColor: 'var(--color-border)', fontSize: 13 }} />
                    <Bar dataKey="conversionCount" fill="var(--color-amber)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={BarChart3} title="No conversions yet" description="Counsellor conversion performance will appear here once admissions are confirmed." />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
