import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Users, UserCheck, Inbox, CalendarDays, GraduationCap, IndianRupee } from 'lucide-react'
import { useAdminDashboard } from '../features/dashboard/hooks'
import StatCard from '../components/StatCard'
import { CardSkeleton } from '../components/Skeleton'

const SOURCE_COLORS = ['#2F6F5E', '#4C5FD5', '#B9740A', '#3B7DDB']

function formatCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function Dashboard() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  const stats = data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-faint mt-0.5">A snapshot of enquiries, admissions, and revenue.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total students" value={stats.totalStudents ?? 0} tone="primary" />
        <StatCard label="Counsellors" value={stats.totalCounsellors ?? 0} sub={`${stats.activeCounsellors ?? 0} active`} />
        <StatCard label="Total enquiries" value={stats.totalEnquiries ?? 0} sub={`${stats.todaysEnquiries ?? 0} today`} />
        <StatCard label="Revenue collected" value={formatCurrency(stats.totalRevenue)} tone="primary" />
        <StatCard label="Admissions done" value={stats.admissionsDoneCount ?? 0} tone="primary" />
        <StatCard label="Not interested" value={stats.notInterestedCount ?? 0} />
        <StatCard label="Today's enquiries" value={stats.todaysEnquiries ?? 0} />
        <StatCard label="Active counsellors" value={stats.activeCounsellors ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border-soft bg-surface p-5 shadow-card">
          <h2 className="text-sm font-bold text-ink">Enquiries by source</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.enquiriesBySource || []}
                  dataKey="count"
                  nameKey="source"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {(stats.enquiriesBySource || []).map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#E4E4E0', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {(stats.enquiriesBySource || []).map((s, i) => (
              <div key={s.source} className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                {s.source} · {s.count}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border-soft bg-surface p-5 shadow-card">
          <h2 className="text-sm font-bold text-ink">Conversions by counsellor</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.conversionsByCounsellor || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEDE9" vertical={false} />
                <XAxis dataKey="counsellorName" tick={{ fontSize: 11, fill: '#8B8D96' }} axisLine={{ stroke: '#E4E4E0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8B8D96' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#E4E4E0', fontSize: 13 }} />
                <Bar dataKey="conversions" fill="#2F6F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
