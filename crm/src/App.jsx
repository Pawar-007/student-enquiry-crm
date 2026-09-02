import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './routes/ProtectedRoute'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import PublicLayout from './layouts/PublicLayout'

// Public (marketing) pages — no auth
import Landing from './pages/public/Landing'
import PublicCourses from './pages/public/PublicCourses'
import PublicCourseDetail from './pages/public/PublicCourseDetail'
import ApplyForm from './pages/public/ApplyForm'

// Staff (authenticated) pages — unchanged logic, moved under /portal
import Login from './pages/Login'
import RoleRedirect from './pages/RoleRedirect'
import Dashboard from './pages/Dashboard'
import EnquiriesAdmin from './pages/EnquiriesAdmin'
import EnquiryDetail from './pages/EnquiryDetail'
import MyEnquiries from './pages/MyEnquiries'
import TodayFollowups from './pages/TodayFollowups'
import NewEnquiry from './pages/NewEnquiry'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import CoursesManage from './pages/CoursesManage'
import CourseManageDetail from './pages/CourseManageDetail'
import Teachers from './pages/Teachers'
import Counsellors from './pages/Counsellors'
import StudentProfile from './pages/StudentProfile'
import EnrollmentDetail from './pages/EnrollmentDetail'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontSize: 13, fontFamily: 'Manrope, sans-serif', borderRadius: 8 },
            }}
          />
          <Routes>
            {/* ---------- Public marketing zone (no auth) ---------- */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/courses" element={<PublicCourses />} />
              <Route path="/courses/:id" element={<PublicCourseDetail />} />
              <Route path="/apply" element={<ApplyForm />} />
            </Route>

            {/* Staff login lives outside both layouts' chrome */}
            <Route element={<AuthLayout />}>
              <Route path="/staff-login" element={<Login />} />
            </Route>

            {/* ---------- Staff zone (authenticated dashboard) ---------- */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RoleRedirect />} />

              {/* Shared */}
              <Route path="enquiries/:id" element={<EnquiryDetail />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="students/:id" element={<StudentProfile />} />
              <Route path="enrollments/:id" element={<EnrollmentDetail />} />

              {/* Admin only */}
              <Route path="dashboard" element={<ProtectedRoute roles={['Admin']}><Dashboard /></ProtectedRoute>} />
              <Route path="enquiries" element={<ProtectedRoute roles={['Admin']}><EnquiriesAdmin /></ProtectedRoute>} />
              <Route path="counsellors" element={<ProtectedRoute roles={['Admin']}><Counsellors /></ProtectedRoute>} />
              <Route path="courses/manage" element={<ProtectedRoute roles={['Admin']}><CoursesManage /></ProtectedRoute>} />
              <Route path="courses/manage/:id" element={<ProtectedRoute roles={['Admin']}><CourseManageDetail /></ProtectedRoute>} />
              <Route path="teachers" element={<ProtectedRoute roles={['Admin']}><Teachers /></ProtectedRoute>} />

              {/* Counsellor only */}
              <Route path="my-enquiries" element={<ProtectedRoute roles={['Counsellor']}><MyEnquiries /></ProtectedRoute>} />
              <Route path="today" element={<ProtectedRoute roles={['Counsellor']}><TodayFollowups /></ProtectedRoute>} />
              <Route path="enquiries/new" element={<ProtectedRoute roles={['Counsellor']}><NewEnquiry /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
