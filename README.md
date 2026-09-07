# Ascendra — Student Enquiry & Admission CRM

A full-stack CRM for educational institutes to manage student enquiries end-to-end — from first contact (walk-in, phone call, or the public website) through follow-ups, admission conversion, and fee payments.

---

## Project Structure

```
student-crm/
├── student-enquiry-crm/     # Backend — Spring Boot REST API
├── crm-frontend/            # Frontend — React + Vite + Tailwind (staff portal + public site)
└── README.md
```

---

## Tech Stack

**Backend**
- Java, Spring Boot, Spring Data JPA / Hibernate
- MySQL
- Custom JWT authentication — a lightweight servlet `Filter` + `HandlerInterceptor` implementation (no Spring Security)
- BCrypt password hashing (`spring-security-crypto`, used standalone)

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts (dashboard charts)

---

## Core Concepts

### Two staff roles
| Role | Can do |
|---|---|
| **Admin** | Full access: manage courses/teachers/batches/counsellors, assign counsellors to Phone/Website enquiries, view all data, dashboard & revenue |
| **Counsellor** | Manage only their own assigned enquiries, add follow-ups, confirm admissions |

There is no "Student" login — students never authenticate. They interact only through the public site.

### Three enquiry sources, three different flows
| Source | Who creates it | Who assigns the counsellor |
|---|---|---|
| **Walk-in** | The attending Counsellor | Self — auto-assigned at creation |
| **Phone Call** | Admin | Admin, manually, afterward |
| **Website** | The public, unauthenticated, via `/apply` | Admin, manually, afterward |

### Enquiry → Student → Enrollment
- The `enquiries` table stores only lead-tracking fields (name, contact, source, status, priority).
- Full personal detail (DOB, address, education, etc.) is only collected in `students`, and only once admission is confirmed.
- A student is looked up by mobile number before creating a new one — the same person enrolling in a second course reuses their existing student record. Each course they take is a separate row in `enrollments`.
- `paidAmount` / `pendingAmount` on an enrollment are **never stored** — they're always calculated from the `payments` table at read time, so they can never drift out of sync.

### Database tables (11)
`users`, `courses`, `modules`, `teachers`, `module_teacher_mapping`, `enquiries`, `followups`, `students`, `enrollments`, `batches`, `payments`

---

## Authentication

There is no Spring Security — auth is implemented manually:

1. `POST /api/auth/login` checks the email/password (BCrypt) and returns a JWT containing `userId`, `email`, and `role`.
2. `JwtAuthFilter` (a `Filter`) reads the `Authorization: Bearer <token>` header on every `/api/*` request, verifies it, and stores the decoded user in a `ThreadLocal` (`CurrentUserContext`) for the duration of the request.
3. `/api/auth/**` and `/api/public/**` are exempt from the filter.
4. `@RequireRole("Admin")` (a custom annotation) + `RoleCheckInterceptor` enforce role-based access on specific endpoints — the equivalent of Spring Security's `@PreAuthorize`.
5. Ownership checks (e.g. "a Counsellor can only see their own enquiries") are done manually inside the Service layer using `CurrentUserContext`, not at the controller level.

There is no self-registration. The first Admin must be inserted directly into the database (see Setup below); Admin creates all Counsellor accounts afterward.

---

## Getting Started

### 1. Database

```sql
CREATE DATABASE crmsystem;
```
Run the project's schema SQL to create all 11 tables before starting the app (`ddl-auto` is set to `validate`, not `update`, so it won't create them for you).

### 2. Backend config

`student-enquiry-crm/src/main/resources/application.properties` (not committed — see `.gitignore`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crmsystem
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

jwt.secret=a-long-random-secret-string
jwt.expiration=86400000

cors.allowed-origins=http://localhost:5173
```

### 3. Create the first Admin

```java
// run once, anywhere, to get a BCrypt hash
new BCryptPasswordEncoder().encode("your-password");
```

```sql
INSERT INTO users (name, email, password, role, mobile, status, created_at)
VALUES ('Super Admin', 'admin@crm.com', '<bcrypt-hash-here>', 'Admin', '9999999999', 'Active', NOW());
```

### 4. Run the backend

```bash
cd student-enquiry-crm
mvn spring-boot:run
```
API at `http://localhost:8080/api`

### 5. Run the frontend

```bash
cd crm-frontend
npm install
npm run dev
```
App at `http://localhost:5173`

---

## API Reference

| Resource | Base path | Auth |
|---|---|---|
| Auth | `/api/auth` | Public |
| Public site (courses, apply) | `/api/public` | Public |
| Users (staff accounts) | `/api/users` | Admin |
| Courses | `/api/courses` | Login required; write = Admin |
| Modules | `/api/modules` | Login required; write = Admin |
| Teachers | `/api/teachers` | Login required; write = Admin |
| Batches | `/api/batches` | Login required; write = Admin |
| Enquiries | `/api/enquiries` | Login required; ownership-scoped for Counsellor |
| Follow-ups | `/api/followups` | Login required; ownership-scoped for Counsellor |
| Enrollments | `/api/enrollments` | Login required |
| Payments | `/api/payments` | Login required; revenue = Admin |
| Dashboard | `/api/dashboard/admin` | Admin |

All non-public routes require `Authorization: Bearer <token>`.

---

## Enum Values — Read This Before Touching the Frontend

Fields like `enquirySource`, `status`, `outcome`, and `paymentMethod` use a custom JPA `AttributeConverter` on the backend so the **database** can store readable values like `"Demo Scheduled"` or `"Walk-in"`. This conversion is a persistence-layer-only concern — it does **not** apply to JSON. Over the API, every enum is serialized/deserialized as its **exact Java constant name**, e.g.:

- `Enquiry.Status`: `New`, `Interested`, `Demo_Scheduled`, `Admission_Done`, `Not_Interested`
- `Enquiry.Priority`: `Hot`, `Warm`, `Cold`
- `Enquiry.EnquirySource`: `Walk_in`, `Phone_Call`, `Website`
- `Followup.Outcome`: `Interested`, `Not_Interested`, `No_Response`, `Call_Back_Later`, `Demo_Scheduled`, `Other`
- `Payment.PaymentMethod`: `Cash`, `UPI`, `Card`, `Bank_Transfer`, `Other`
- `Enrollment.EnrollmentStatus`: `Active`, `Completed`, `Dropped`

The single source of truth for these on the frontend is `crm-frontend/src/utils/enumConfig.js` — always import from there rather than hardcoding strings, and never use `SCREAMING_SNAKE_CASE` or values with spaces/hyphens when calling the API.

---

## Design Notes

- User accounts are never hard-deleted — Admin blocks/unblocks a Counsellor instead (`status: Active | Blocked`).
- The public site (`/`, `/courses`, `/apply`) requires no login; the staff portal lives under `/portal/*` and is role-gated.
- Response DTOs never nest a full parent entity (to avoid circular JSON references) — only lightweight "Summary" DTOs (e.g. `CourseSummaryDTO` inside `EnquiryResponseDTO`).
- All create/update DTOs use a single shared DTO for both `POST` and `PATCH` — partial updates only touch non-null fields (`CommonUtils.copyNonNullProperties`).
