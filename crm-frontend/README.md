# Ledger — Education CRM Frontend

A production-quality React + Vite frontend for an Education/Training Institute CRM,
built against a Spring Boot REST API.

## Stack

- React 19 + Vite
- React Router (auth-aware, role-based route guards)
- Axios (centralized client with JWT interceptor)
- Tailwind CSS v4
- Recharts (dashboard charts)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend
npm run dev
```

The app expects a Spring Boot backend implementing the DTO contracts described
in the project brief (auth, courses, enquiries, followups, enrollments,
payments, teachers, users, batches, modules, module-teacher-mapping,
dashboard). Nothing is mocked — every data-driven page calls a real endpoint.

## Environment

`VITE_API_BASE_URL` is the only environment variable. It is read once in
`src/api/apiClient.js` and never hardcoded anywhere else in the app.

## Folder structure

```
src/
  api/            one file per backend resource (axios calls only)
  components/
    ui/           generic building blocks (Button, Modal, DataTable, ...)
    crm/          CRM-specific composites (EnquiryTable, AddEnquiryDrawer, Timeline, Logo)
  layouts/        PublicLayout, AdminLayout, CounsellorLayout, DashboardShell
  pages/
    public/       Home, Courses, CourseDetail, Enquiry
    auth/         Login
    admin/        every /admin/* page
    counsellor/   every /counsellor/* page
    shared/       EnquiryDetail (rendered at both /admin/enquiries/:id and /counsellor/enquiries/:id)
  routes/         PublicRoute, AuthenticatedRoute, AdminRoute, CounsellorRoute
  context/        AuthContext (JWT/email/role), ToastContext
  hooks/          useAuth, useToast, useApi (small fetch/loading/error hook)
  constants/      enums.js — the single source of truth for backend enum values/labels
  utils/          format.js (date/currency), validators.js (client-side validation)
```

## Auth & route protection

- `AuthContext` stores `{ token, email, role }` in `localStorage` and exposes
  `login`/`logout`.
- `apiClient.js` attaches `Authorization: Bearer <token>` to every request and
  triggers a global logout on any `401`/`403` response.
- Route guards nest in `App.jsx`:
  `AuthenticatedRoute` → `AdminRoute` / `CounsellorRoute`. A Counsellor
  visiting an admin-only URL is redirected to their own dashboard, and vice
  versa — the backend remains the actual authority.

## Error handling

Every mutation (create, update, delete, status/priority changes) follows the
same pattern: on failure, `err.validationErrors` (matching the backend's
`ErrorResponseDTO.validationErrors`) is mapped directly onto form fields; any
other failure shows a toast with `err.message`. No raw Spring error payloads
are ever rendered.

## Notes on scope

A few backend endpoints implied by the brief (a dedicated reports API,
account self-service) aren't part of the documented contract. Rather than
invent endpoints, those screens (`Reports`, `Settings`) are honest,
clearly-labeled placeholders that point at what's actually wired up
(Dashboard, Revenue). Everything else in the checklist — auth, public site,
enquiry lifecycle, follow-ups, admissions, payments, course/batch/module/
teacher management — calls real endpoints with no mock data.
