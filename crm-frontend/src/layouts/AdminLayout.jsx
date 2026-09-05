import {
  LayoutDashboard, Inbox, UserX, GraduationCap, CalendarClock,
  Users, User, BookOpen, Layers, ListTree, Link2, Wallet, TrendingUp, BarChart3, Settings,
} from 'lucide-react';
import DashboardShell from './DashboardShell';

const sections = [
  {
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'CRM',
    items: [
      { to: '/admin/enquiries', label: 'All Enquiries', icon: Inbox },
      { to: '/admin/enquiries/unassigned', label: 'Unassigned', icon: UserX },
      { to: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
      { to: '/admin/followups', label: 'Follow-ups', icon: CalendarClock },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/admin/counsellors', label: 'Counsellors', icon: Users },
      { to: '/admin/teachers', label: 'Teachers', icon: User },
      { to: '/admin/courses', label: 'Courses', icon: BookOpen },
      { to: '/admin/batches', label: 'Batches', icon: Layers },
    ],
  },
  {
    title: 'Academic',
    items: [
      { to: '/admin/modules', label: 'Course Modules', icon: ListTree },
      { to: '/admin/teacher-assignments', label: 'Teacher Assignments', icon: Link2 },
    ],
  },
  {
    title: 'Finance',
    items: [
      { to: '/admin/payments', label: 'Payments', icon: Wallet },
      { to: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
    ],
  },
  {
    items: [
      { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  return <DashboardShell sections={sections} roleLabel="Administrator" />;
}
