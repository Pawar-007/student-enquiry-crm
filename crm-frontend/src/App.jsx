import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import CounsellorLayout from './layouts/CounsellorLayout';

import PublicRoute from './routes/PublicRoute';
import AuthenticatedRoute from './routes/AuthenticatedRoute';
import AdminRoute from './routes/AdminRoute';
import CounsellorRoute from './routes/CounsellorRoute';

import Home from './pages/public/Home';
import Courses from './pages/public/Courses';
import CourseDetail from './pages/public/CourseDetail';
import Enquiry from './pages/public/Enquiry';
import Login from './pages/auth/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import EnquiriesList from './pages/admin/EnquiriesList';
import UnassignedEnquiries from './pages/admin/UnassignedEnquiries';
import AdminFollowups from './pages/admin/AdminFollowups';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import Counsellors from './pages/admin/Counsellors';
import Teachers from './pages/admin/Teachers';
import AdminCourses from './pages/admin/Courses';
import CourseAdminDetail from './pages/admin/CourseAdminDetail';
import Batches from './pages/admin/Batches';
import Modules from './pages/admin/Modules';
import TeacherAssignments from './pages/admin/TeacherAssignments';
import Payments from './pages/admin/Payments';
import Revenue from './pages/admin/Revenue';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

import CounsellorDashboard from './pages/counsellor/CounsellorDashboard';
import CounsellorEnquiries from './pages/counsellor/CounsellorEnquiries';
import CounsellorFollowups from './pages/counsellor/CounsellorFollowups';
import CounsellorAdmissions from './pages/counsellor/CounsellorAdmissions';

import EnquiryDetail from './pages/shared/EnquiryDetail';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/enquiry" element={<Enquiry />} />
            </Route>

            {/* Login — redirects away if already authenticated */}
            <Route element={<PublicRoute />}>
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>
            </Route>

            {/* Authenticated area */}
            <Route element={<AuthenticatedRoute />}>
              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="enquiries" element={<EnquiriesList />} />
                  <Route path="enquiries/unassigned" element={<UnassignedEnquiries />} />
                  <Route path="enquiries/:id" element={<EnquiryDetail />} />
                  <Route path="admissions" element={<AdminAdmissions />} />
                  <Route path="followups" element={<AdminFollowups />} />
                  <Route path="counsellors" element={<Counsellors />} />
                  <Route path="teachers" element={<Teachers />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="courses/:courseId" element={<CourseAdminDetail />} />
                  <Route path="batches" element={<Batches />} />
                  <Route path="modules" element={<Modules />} />
                  <Route path="teacher-assignments" element={<TeacherAssignments />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="revenue" element={<Revenue />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Counsellor */}
              <Route element={<CounsellorRoute />}>
                <Route path="/counsellor" element={<CounsellorLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<CounsellorDashboard />} />
                  <Route path="enquiries" element={<CounsellorEnquiries />} />
                  <Route path="enquiries/:id" element={<EnquiryDetail />} />
                  <Route path="followups" element={<CounsellorFollowups />} />
                  <Route path="admissions" element={<CounsellorAdmissions />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
