import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MapPin, Plus, GraduationCap } from 'lucide-react';
import {
  getEnquiryById, updateEnquiryStatus, updateEnquiryPriority, assignEnquiryCounsellor,
} from '../../api/enquiryApi';
import { getFollowupsByEnquiry, createFollowup } from '../../api/followupApi';
import { getActiveCounsellors } from '../../api/userApi';
import { confirmAdmission } from '../../api/enrollmentApi';
import { getCourses } from '../../api/courseApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useApi } from '../../hooks/useApi';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { Select, Input, Textarea } from '../../components/ui/FormField';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Timeline from '../../components/crm/Timeline';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonLine } from '../../components/ui/Skeleton';
import {
  ENQUIRY_STATUS, ENQUIRY_PRIORITY, INTERACTION_TYPES, FOLLOWUP_OUTCOMES,
} from '../../constants/enums';
import { formatDate, formatDateTime, toDateInputValue, formatCurrency } from '../../utils/format';

export default function EnquiryDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const navigate = useNavigate();
  const toast = useToast();
  const basePath = isAdmin ? '/admin/enquiries' : '/counsellor/enquiries';

  const { data: enquiry, loading, error, refetch, setData: setEnquiry } = useApi(() => getEnquiryById(id), [id]);
  const { data: followups, refetch: refetchFollowups, setData: setFollowups } = useApi(() => getFollowupsByEnquiry(id), [id]);

  const [counsellors, setCounsellors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [followupDrawerOpen, setFollowupDrawerOpen] = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPriority, setSavingPriority] = useState(false);
  const [savingAssign, setSavingAssign] = useState(false);

  useEffect(() => {
    if (isAdmin) getActiveCounsellors().then(setCounsellors).catch(() => setCounsellors([]));
    getCourses().then(setCourses).catch(() => setCourses([]));
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl">
        <SkeletonLine className="w-40 h-4" />
        <SkeletonLine className="w-1/2 h-8" />
        <SkeletonLine className="w-full h-32" />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!enquiry) return null;

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    if (!status) return;
    setSavingStatus(true);
    try {
      const updated = await updateEnquiryStatus(id, status);
      setEnquiry((prev) => ({ ...prev, status: updated?.status || status }));
      toast.success('Enquiry status updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePriorityChange = async (e) => {
    const priority = e.target.value;
    if (!priority) return;
    setSavingPriority(true);
    try {
      const updated = await updateEnquiryPriority(id, priority);
      setEnquiry((prev) => ({ ...prev, priority: updated?.priority || priority }));
      toast.success('Priority updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPriority(false);
    }
  };

  const handleAssign = async (e) => {
    const counsellorId = e.target.value;
    if (!counsellorId) return;
    setSavingAssign(true);
    try {
      const updated = await assignEnquiryCounsellor(id, counsellorId);
      setEnquiry((prev) => ({ ...prev, counsellor: updated?.counsellor || prev.counsellor }));
      toast.success('Counsellor assigned successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingAssign(false);
    }
  };

  const timelineItems = [
    { title: 'Enquiry created', time: formatDateTime(enquiry.createdAt), dotColor: 'var(--color-cobalt)' },
    ...(followups || [])
      .slice()
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
      .map((f) => ({
        title: `${f.interactionType} follow-up — ${f.status}`,
        description: f.remarks || (f.outcome ? `Outcome: ${f.outcome}` : undefined),
        time: f.completedAt ? formatDateTime(f.completedAt) : formatDate(f.scheduledAt),
        dotColor: f.status === 'COMPLETED' ? 'var(--color-success)' : f.status === 'MISSED' ? 'var(--color-danger)' : 'var(--color-amber)',
      })),
  ];

  return (
    <div className="max-w-5xl">
      <button onClick={() => navigate(basePath)} className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] mb-5">
        <ChevronLeft size={16} /> Back to enquiries
      </button>

      {/* Header */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-[var(--color-ink)]">{enquiry.fullName}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[var(--color-ink-soft)]">
              <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {enquiry.mobileNumber}</span>
              {enquiry.email && <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {enquiry.email}</span>}
              {enquiry.city && <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {enquiry.city}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge list={ENQUIRY_STATUS} value={enquiry.status} />
            <StatusBadge list={ENQUIRY_PRIORITY} value={enquiry.priority} />
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 text-sm text-[var(--color-muted)]">
          <span>Course: <span className="text-[var(--color-ink)] font-medium">{enquiry.course?.courseName || '—'}</span></span>
          <span>Counsellor: <span className="text-[var(--color-ink)] font-medium">{enquiry.counsellor?.name || 'Unassigned'}</span></span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Info sections */}
          <Section title="Student Information">
            <InfoGrid items={[
              ['Full Name', enquiry.fullName],
              ['Mobile', enquiry.mobileNumber],
              ['Alternate Mobile', enquiry.alternateMobile || '—'],
              ['Email', enquiry.email || '—'],
              ['City', enquiry.city || '—'],
            ]} />
          </Section>

          <Section title="Requirement">
            <InfoGrid items={[
              ['Course', enquiry.course?.courseName || '—'],
              ['Course Mode', enquiry.courseMode || '—'],
              ['Budget Range', enquiry.budgetRange || '—'],
            ]} />
          </Section>

          <Section title="Lead">
            <InfoGrid items={[
              ['Source', enquiry.enquirySource || '—'],
              ['Status', enquiry.status || '—'],
              ['Priority', enquiry.priority || '—'],
              ['Assigned Counsellor', enquiry.counsellor?.name || 'Unassigned'],
            ]} />
          </Section>

          <Section title="Timeline">
            <Timeline items={timelineItems} />
          </Section>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Actions</p>

            <Button icon={Plus} onClick={() => setFollowupDrawerOpen(true)} className="w-full">Add Follow-up</Button>

            <Select
              label="Update Status"
              value=""
              onChange={handleStatusChange}
              options={ENQUIRY_STATUS}
              disabled={savingStatus}
            />
            <Select
              label="Change Priority"
              value=""
              onChange={handlePriorityChange}
              options={ENQUIRY_PRIORITY}
              disabled={savingPriority}
            />
            {isAdmin && (
              <Select
                label="Assign Counsellor"
                value=""
                onChange={handleAssign}
                options={counsellors.map((c) => ({ value: String(c.userId), label: c.name }))}
                disabled={savingAssign}
              />
            )}

            {enquiry.status !== 'ADMISSION_DONE' && (
              <Button variant="amber" icon={GraduationCap} onClick={() => setAdmissionOpen(true)} className="w-full">
                Confirm Admission
              </Button>
            )}
          </div>
        </div>
      </div>

      <AddFollowupDrawer
        open={followupDrawerOpen}
        onClose={() => setFollowupDrawerOpen(false)}
        enquiryId={id}
        onCreated={(f) => setFollowups((prev) => (prev ? [f, ...prev] : [f]))}
      />

      <ConfirmAdmissionModal
        open={admissionOpen}
        onClose={() => setAdmissionOpen(false)}
        enquiry={enquiry}
        courses={courses}
        onConfirmed={() => {
          setEnquiry((prev) => ({ ...prev, status: 'ADMISSION_DONE' }));
          toast.success('Admission confirmed and enrollment created');
        }}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-4">{title}</p>
      {children}
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <dl className="grid sm:grid-cols-2 gap-4">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
          <dd className="text-sm text-[var(--color-ink)] mt-0.5">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AddFollowupDrawer({ open, onClose, enquiryId, onCreated }) {
  const toast = useToast();
  const [form, setForm] = useState({ interactionType: '', scheduledAt: '', remarks: '', nextFollowupAt: '' });
  const [submitting, setSubmitting] = useState(false);
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (open) setForm({ interactionType: '', scheduledAt: '', remarks: '', nextFollowupAt: '' });
  }, [open]);

  const handleSubmit = async () => {
    if (!form.interactionType || !form.scheduledAt) {
      toast.error('Interaction type and scheduled date are required.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createFollowup({
        enquiryId: Number(enquiryId),
        interactionType: form.interactionType,
        scheduledAt: form.scheduledAt,
        remarks: form.remarks || undefined,
        nextFollowupAt: form.nextFollowupAt || undefined,
      });
      toast.success('Follow-up added successfully');
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Follow-up"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Save Follow-up</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select id="interactionType" label="Interaction Type" required value={form.interactionType} onChange={setField('interactionType')} options={INTERACTION_TYPES} />
        <Input id="scheduledAt" label="Scheduled Date" type="date" required value={form.scheduledAt} onChange={setField('scheduledAt')} />
        <Textarea id="remarks" label="Remarks" value={form.remarks} onChange={setField('remarks')} />
        <Input id="nextFollowupAt" label="Next Follow-up Date" type="date" value={form.nextFollowupAt} onChange={setField('nextFollowupAt')} />
      </div>
    </Drawer>
  );
}

function ConfirmAdmissionModal({ open, onClose, enquiry, courses, onConfirmed }) {
  const toast = useToast();
  const [courseId, setCourseId] = useState('');
  const [totalFees, setTotalFees] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCourseId(enquiry?.course?.courseId ? String(enquiry.course.courseId) : '');
      setTotalFees('');
    }
  }, [open, enquiry]);

  const handleConfirm = async () => {
    if (!courseId || !totalFees) {
      toast.error('Course and total fees are required.');
      return;
    }
    setSubmitting(true);
    try {
      await confirmAdmission({
        enquiryId: enquiry.enquiryId,
        courseId: Number(courseId),
        totalFees: Number(totalFees),
      });
      onConfirmed?.();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm Admission"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="amber" onClick={handleConfirm} loading={submitting}>Confirm Admission</Button>
        </>
      }
    >
      <p className="text-sm text-[var(--color-ink-soft)] mb-5">
        This creates an enrollment for <span className="font-medium text-[var(--color-ink)]">{enquiry?.fullName}</span> and moves the enquiry to Admission Done.
      </p>
      <div className="flex flex-col gap-4">
        <Select
          id="admCourse"
          label="Course"
          required
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          options={courses.map((c) => ({ value: String(c.courseId), label: c.courseName }))}
        />
        <Input id="admFees" label="Total Fees" type="number" required min="0" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} />
      </div>
    </Modal>
  );
}
