# Ledger — Student Enquiry & Admission CRM (Frontend)

A React 18 + Vite frontend for a Student Enquiry & Admission CRM, built against a Spring Boot REST API at `http://localhost:8080/api`.

## Stack
- React 18 + Vite, React Router v6
- Tailwind CSS with a custom theme (no default palette)
- Axios with a JWT interceptor + global 401/403 handling
- TanStack Query for data fetching/caching/mutations
- React Hook Form + Zod for validation
- Recharts for the admin dashboard
- react-hot-toast, lucide-react

## Getting started

```bash
npm install
npm run dev
```

The app expects the backend to be running at `http://localhost:8080/api` (see `src/api/client.js` to change this).

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Two zones, one app

- **Public marketing site** (no auth) — `/`, `/courses`, `/courses/:id`, `/apply`. Uses `PublicLayout` (marketing nav + footer) and `src/api/publicApi.js`, a **separate, token-free** axios instance that talks to `/api/public/*`. It never touches `client.js` or sends a JWT.
- **Staff dashboard** (authenticated) — everything lives under `/portal/*` now (`/portal/dashboard`, `/portal/enquiries`, `/portal/my-enquiries`, etc.), gated by `ProtectedRoute`. Staff sign in at `/staff-login`; `RoleRedirect` sends them to the right `/portal` landing page. Internal logic of every dashboard page is unchanged — only route paths moved under `/portal`.

## Structure

```
src/
  api/          axios instance (JWT) + one file per REST resource, plus publicApi.js (no JWT)
  components/   Button, Badge, Table, Modal, StatCard, Skeleton, EmptyState, Field
  features/     React Query hooks, grouped by domain (enquiries, followups, enrollments, public, ...)
  hooks/        useAuth (JWT + role, backed by localStorage)
  layouts/      AuthLayout (staff login), AppLayout (staff sidebar+topbar), PublicLayout (marketing nav+footer)
  pages/        route-level screens for the staff dashboard
  pages/public/ route-level screens for the public site (Landing, PublicCourses, PublicCourseDetail, ApplyForm)
  routes/       ProtectedRoute (auth + role gate), guards /portal/*
```

## Design notes
- Palette: paper `#F7F7F4` background, ink `#1C1D21` text, primary teal `#2F6F5E` (admission/growth actions), accent indigo `#4C5FD5` (links/secondary actions). Priority pills are Hot `#DC4B3E` / Warm `#B9740A` / Cold `#3B7DDB`, kept visually distinct from the brand colors.
- Typefaces: Manrope for UI and headings, IBM Plex Mono for all numeric data (fees, phone numbers, dates, counts) — the `.num` utility class applies it.
- Business rules encoded in the UI:
  - Walk-in enquiries hide the counsellor field (auto-assigned server-side) — see `NewEnquiry.jsx`.
  - Admin's Enquiries page has a dedicated "Unassigned" tab with inline assignment — see `EnquiriesAdmin.jsx`.
  - Counsellors only ever call `/enquiries/my` and `/followups/today` — never an admin-only endpoint.
  - "Confirm Admission" is a distinct modal gated on status `Interested`/`Demo Scheduled`, not a generic edit form — see `EnquiryDetail.jsx`.
  - Payments are add-only; `paidAmount`/`pendingAmount` are rendered exactly as returned by the backend, never computed client-side — see `EnrollmentDetail.jsx`.

## What's stubbed simpler
Teachers/Modules/Batches management is intentionally minimal (plain CRUD lists/forms in `Teachers.jsx` and `CourseManageDetail.jsx`) per the brief's priority: auth, role routing, and the Enquiry → Follow-up → Admission → Payment flow are built out fully first.
