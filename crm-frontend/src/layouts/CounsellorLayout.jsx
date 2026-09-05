import { LayoutDashboard, Inbox, CalendarClock, GraduationCap } from 'lucide-react';
import DashboardShell from './DashboardShell';

const sections = [
  {
    items: [
      { to: '/counsellor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/counsellor/enquiries', label: 'My Enquiries', icon: Inbox },
      { to: '/counsellor/followups', label: 'Follow-ups', icon: CalendarClock },
      { to: '/counsellor/admissions', label: 'Admissions', icon: GraduationCap },
    ],
  },
];

export default function CounsellorLayout() {
  return <DashboardShell sections={sections} roleLabel="Counsellor" />;
}
