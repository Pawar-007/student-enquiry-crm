// // Centralized enum configuration.
// // IMPORTANT: the "value" fields are the EXACT strings the backend expects/returns.
// // If backend enum values change, update ONLY this file — the rest of the app
// // reads labels/colors from here rather than hardcoding strings.

// export const ROLES = {
//   ADMIN: 'ADMIN',
//   COUNSELLOR: 'COUNSELLOR',
// };

// export const USER_STATUS = [
//   { value: 'ACTIVE', label: 'Active', tone: 'success' },
//   { value: 'BLOCKED', label: 'Blocked', tone: 'danger' },
// ];

// export const COURSE_MODES = [
//   { value: 'ONLINE', label: 'Online' },
//   { value: 'OFFLINE', label: 'Offline' },
//   { value: 'HYBRID', label: 'Hybrid' },
// ];

// export const ENQUIRY_SOURCES = [
//   { value: 'WEBSITE', label: 'Website' },
//   { value: 'REFERRAL', label: 'Referral' },
//   { value: 'SOCIAL_MEDIA', label: 'Social Media' },
//   { value: 'WALK_IN', label: 'Walk-in' },
//   { value: 'PHONE', label: 'Phone' },
//   { value: 'ADVERTISEMENT', label: 'Advertisement' },
//   { value: 'OTHER', label: 'Other' },
// ];

// export const ENQUIRY_STATUS = [
//   { value: 'NEW', label: 'New', tone: 'info' },
//   { value: 'CONTACTED', label: 'Contacted', tone: 'neutral' },
//   { value: 'FOLLOW_UP', label: 'Follow-up', tone: 'warning' },
//   { value: 'INTERESTED', label: 'Interested', tone: 'success' },
//   { value: 'NOT_INTERESTED', label: 'Not Interested', tone: 'danger' },
//   { value: 'ADMISSION_DONE', label: 'Admission Done', tone: 'success' },
// ];

// export const ENQUIRY_PRIORITY = [
//   { value: 'HIGH', label: 'High', tone: 'danger' },
//   { value: 'MEDIUM', label: 'Medium', tone: 'warning' },
//   { value: 'LOW', label: 'Low', tone: 'neutral' },
// ];

// export const BUDGET_RANGES = [
//   { value: 'UNDER_10K', label: 'Under ₹10,000' },
//   { value: 'RANGE_10K_25K', label: '₹10,000 – ₹25,000' },
//   { value: 'RANGE_25K_50K', label: '₹25,000 – ₹50,000' },
//   { value: 'RANGE_50K_1L', label: '₹50,000 – ₹1,00,000' },
//   { value: 'ABOVE_1L', label: 'Above ₹1,00,000' },
// ];

// export const INTERACTION_TYPES = [
//   { value: 'CALL', label: 'Call' },
//   { value: 'EMAIL', label: 'Email' },
//   { value: 'WHATSAPP', label: 'WhatsApp' },
//   { value: 'MEETING', label: 'Meeting' },
//   { value: 'SMS', label: 'SMS' },
// ];

// export const FOLLOWUP_OUTCOMES = [
//   { value: 'INTERESTED', label: 'Interested' },
//   { value: 'NOT_INTERESTED', label: 'Not Interested' },
//   { value: 'NO_RESPONSE', label: 'No Response' },
//   { value: 'CALL_BACK_LATER', label: 'Call Back Later' },
//   { value: 'ADMISSION_CONFIRMED', label: 'Admission Confirmed' },
// ];

// export const FOLLOWUP_STATUS = [
//   { value: 'Scheduled', label: 'Scheduled', tone: 'info' },
//   { value: 'Completed', label: 'Completed', tone: 'success' },
//   { value: 'Missed', label: 'Missed', tone: 'danger' },
//   { value: 'Cancelled', label: 'Cancelled', tone: 'neutral' },
// ];


// export const BATCH_STATUS = [
//   { value: 'UPCOMING', label: 'Upcoming', tone: 'info' },
//   { value: 'ONGOING', label: 'Ongoing', tone: 'success' },
//   { value: 'COMPLETED', label: 'Completed', tone: 'neutral' },
//   { value: 'CANCELLED', label: 'Cancelled', tone: 'danger' },
// ];

// export const ENROLLMENT_STATUS = [
//   { value: 'PENDING', label: 'Pending', tone: 'warning' },
//   { value: 'ACTIVE', label: 'Active', tone: 'success' },
//   { value: 'COMPLETED', label: 'Completed', tone: 'neutral' },
//   { value: 'CANCELLED', label: 'Cancelled', tone: 'danger' },
// ];

// export const PAYMENT_METHODS = [
//   { value: 'CASH', label: 'Cash' },
//   { value: 'CARD', label: 'Card' },
//   { value: 'UPI', label: 'UPI' },
//   { value: 'NET_BANKING', label: 'Net Banking' },
//   { value: 'CHEQUE', label: 'Cheque' },
//   { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
// ];

// export const GENDER = [
//   { value: 'MALE', label: 'Male' },
//   { value: 'FEMALE', label: 'Female' },
//   { value: 'OTHER', label: 'Other' },
// ];

// // Helper: find the { label, tone } entry for a raw backend enum value.
// export function findEnumMeta(list, value) {
//   return list.find((item) => item.value === value) || { value, label: value, tone: 'neutral' };
// }


// Centralized enum configuration.
//
// IMPORTANT: the "value" fields are the EXACT strings the backend
// expects/returns over JSON. These MUST match the Java enum CONSTANT NAME
// exactly (e.g. "Demo_Scheduled"), not the DB-stored string (which can
// differ, e.g. "Demo Scheduled" with a space) and not SCREAMING_SNAKE_CASE.
//
// Why: entity fields with a JPA @Convert (AttributeConverter) only get
// that conversion applied at the database layer by Hibernate. Jackson
// (which serializes/deserializes the JSON the frontend actually sends
// and receives) and Spring MVC's @RequestParam enum binding both use the
// raw Java enum constant name by default — Enum.valueOf(). So the value
// on the wire is always the Java identifier, case-sensitive, exactly as
// declared in the entity's enum.
//
// If backend enum values ever change, update ONLY this file — the rest
// of the app reads labels/tones from here rather than hardcoding strings.

export const ROLES = {
  ADMIN: 'Admin',
  COUNSELLOR: 'Counsellor',
};

// User.UserStatus { Active, Blocked }
export const USER_STATUS = [
  { value: 'Active', label: 'Active', tone: 'success' },
  { value: 'Blocked', label: 'Blocked', tone: 'danger' },
];

// Enquiry.CourseMode { Online, Offline } — only these two exist on the backend
export const COURSE_MODES = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
];

// Enquiry.EnquirySource { Walk_in, Phone_Call, Website } — only these three exist.
// Do not add Referral/Social Media/Advertisement/Other — the backend has no
// such constants and will reject them.
export const ENQUIRY_SOURCES = [
  { value: 'Walk_in', label: 'Walk-in' },
  { value: 'Phone_Call', label: 'Phone Call' },
  { value: 'Website', label: 'Website' },
];

// Enquiry.Status { New, Interested, Demo_Scheduled, Admission_Done, Not_Interested }
export const ENQUIRY_STATUS = [
  { value: 'New', label: 'New', tone: 'info' },
  { value: 'Interested', label: 'Interested', tone: 'success' },
  { value: 'Demo_Scheduled', label: 'Demo Scheduled', tone: 'warning' },
  { value: 'Admission_Done', label: 'Admission Done', tone: 'success' },
  { value: 'Not_Interested', label: 'Not Interested', tone: 'danger' },
];

// Enquiry.Priority { Hot, Warm, Cold } — NOT High/Medium/Low
export const ENQUIRY_PRIORITY = [
  { value: 'Hot', label: 'Hot', tone: 'danger' },
  { value: 'Warm', label: 'Warm', tone: 'warning' },
  { value: 'Cold', label: 'Cold', tone: 'neutral' },
];

// budgetRange is a plain VARCHAR on the backend (not a Java enum), so any
// string is accepted — these are just suggested options for a clean UI,
// not a validated set. Free text also works if you prefer an input field.
export const BUDGET_RANGES = [
  { value: 'Under 20,000', label: 'Under ₹20,000' },
  { value: '20,000-35,000', label: '₹20,000 – ₹35,000' },
  { value: '35,000-50,000', label: '₹35,000 – ₹50,000' },
  { value: '50,000+', label: '₹50,000+' },
];

// Followup.InteractionType { Call, WhatsApp, Email, Walk_in, Other }
export const INTERACTION_TYPES = [
  { value: 'Call', label: 'Call' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Email', label: 'Email' },
  { value: 'Walk_in', label: 'Walk-in' },
  { value: 'Other', label: 'Other' },
];

// Followup.Outcome { Interested, Not_Interested, No_Response, Call_Back_Later, Demo_Scheduled, Other }
// Note: there is no separate "Admission Confirmed" outcome on the backend —
// admission is confirmed via the enrollment flow, not a followup outcome.
export const FOLLOWUP_OUTCOMES = [
  { value: 'Interested', label: 'Interested' },
  { value: 'Not_Interested', label: 'Not Interested' },
  { value: 'No_Response', label: 'No Response' },
  { value: 'Call_Back_Later', label: 'Call Back Later' },
  { value: 'Demo_Scheduled', label: 'Demo Scheduled' },
  { value: 'Other', label: 'Other' },
];

// Followup.FollowupStatus { Scheduled, Completed, Missed, Cancelled }
// This one has no spaces/hyphens in the DB either, so it was already correct.
export const FOLLOWUP_STATUS = [
  { value: 'Scheduled', label: 'Scheduled', tone: 'info' },
  { value: 'Completed', label: 'Completed', tone: 'success' },
  { value: 'Missed', label: 'Missed', tone: 'danger' },
  { value: 'Cancelled', label: 'Cancelled', tone: 'neutral' },
];

// Batch.BatchStatus { Upcoming, Ongoing, Completed } — no "Cancelled" on the backend
export const BATCH_STATUS = [
  { value: 'Upcoming', label: 'Upcoming', tone: 'info' },
  { value: 'Ongoing', label: 'Ongoing', tone: 'success' },
  { value: 'Completed', label: 'Completed', tone: 'neutral' },
];

// Enrollment.EnrollmentStatus { Active, Completed, Dropped } — NOT Pending/Cancelled
export const ENROLLMENT_STATUS = [
  { value: 'Active', label: 'Active', tone: 'success' },
  { value: 'Completed', label: 'Completed', tone: 'neutral' },
  { value: 'Dropped', label: 'Dropped', tone: 'danger' },
];

// Payment.PaymentMethod { Cash, UPI, Card, Bank_Transfer, Other } — NOT Net Banking/Cheque
export const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Bank_Transfer', label: 'Bank Transfer' },
  { value: 'Other', label: 'Other' },
];

// Student.Gender { Male, Female, Other }
export const GENDER = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Helper: find the { label, tone } entry for a raw backend enum value.
export function findEnumMeta(list, value) {
  return list.find((item) => item.value === value) || { value, label: value, tone: 'neutral' };
}