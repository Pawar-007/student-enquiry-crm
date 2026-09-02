import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox, Search } from 'lucide-react'
import { useAllEnquiries, useUnassignedEnquiries, useAssignEnquiry } from '../features/enquiries/hooks'
import { useActiveCounsellors } from '../features/counsellors/hooks'
import { Table, THead, Th, Td, Tr } from '../components/Table'
import { StatusBadge, PriorityBadge } from '../components/Badge'
import { TableSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { Select, Input } from '../components/Field'

const STATUSES = ['New', 'Interested', 'Demo Scheduled', 'Admission Done', 'Not Interested']
const SOURCES = ['Walk-in', 'Phone Call', 'Website']

function AssignCell({ enquiry }) {
  const { data: counsellors } = useActiveCounsellors()
  const assign = useAssignEnquiry()

  return (
    <select
      className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-medium text-ink outline-none focus:border-primary-500"
      defaultValue=""
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        if (e.target.value) assign.mutate({ id: enquiry.id, counsellorId: e.target.value })
      }}
    >
      <option value="" disabled>Assign to…</option>
      {(counsellors || []).map((c) => (
        <option key={c.id} value={c.id}>{c.name || c.email}</option>
      ))}
    </select>
  )
}

export default function EnquiriesAdmin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [search, setSearch] = useState('')

  const allQuery = useAllEnquiries()
  const unassignedQuery = useUnassignedEnquiries()

  const isUnassigned = tab === 'unassigned'
  const { data, isLoading } = isUnassigned ? unassignedQuery : allQuery

  const rows = useMemo(() => {
    let list = data || []
    if (statusFilter) list = list.filter((e) => e.status === statusFilter)
    if (sourceFilter) list = list.filter((e) => e.enquirySource === sourceFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((e) => e.fullName?.toLowerCase().includes(q) || e.mobileNumber?.includes(q) || e.email?.toLowerCase().includes(q))
    }
    return list
  }, [data, statusFilter, sourceFilter, search])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Enquiries</h1>
          <p className="text-sm text-ink-faint mt-0.5">All leads across every counsellor.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border-soft">
        {[
          { key: 'all', label: 'All enquiries' },
          { key: 'unassigned', label: `Unassigned${unassignedQuery.data?.length ? ` (${unassignedQuery.data.length})` : ''}` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-primary-500 text-ink' : 'border-transparent text-ink-faint hover:text-ink-soft'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input placeholder="Search name, phone, email" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {!isUnassigned && (
          <Select className="w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        )}
        <Select className="w-auto" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option value="">All sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border-soft bg-surface"><TableSkeleton /></div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={isUnassigned ? 'No unassigned enquiries' : 'No enquiries match your filters'}
          description={isUnassigned ? 'Every phone and website lead has a counsellor.' : 'Try adjusting the filters above.'}
        />
      ) : (
        <Table>
          <THead>
            <Th>Name</Th>
            <Th>Mobile</Th>
            <Th>Source</Th>
            <Th>Status</Th>
            <Th>Priority</Th>
            {isUnassigned ? <Th>Assign</Th> : <Th>Counsellor</Th>}
          </THead>
          <tbody>
            {rows.map((e) => (
              <Tr key={e.id} onClick={() => navigate(`/portal/enquiries/${e.id}`)}>
                <Td className="font-semibold">{e.fullName}</Td>
                <Td className="num text-ink-soft">{e.mobileNumber}</Td>
                <Td className="text-ink-soft">{e.enquirySource}</Td>
                <Td><StatusBadge status={e.status} /></Td>
                <Td><PriorityBadge priority={e.priority} /></Td>
                {isUnassigned ? (
                  <Td><AssignCell enquiry={e} /></Td>
                ) : (
                  <Td className="text-ink-soft">{e.counsellorName || '—'}</Td>
                )}
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
