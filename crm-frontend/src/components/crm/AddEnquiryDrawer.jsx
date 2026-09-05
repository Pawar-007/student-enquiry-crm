import { useEffect, useState } from 'react';
import Drawer from '../ui/Drawer';
import { Input, Select } from '../ui/FormField';
import Button from '../ui/Button';
import { COURSE_MODES, BUDGET_RANGES, ENQUIRY_SOURCES, ENQUIRY_PRIORITY } from '../../constants/enums';
import { getCourses } from '../../api/courseApi';
import { createEnquiry } from '../../api/enquiryApi';
import { isRequired, isValidEmail, isTenDigitMobile, runValidators } from '../../utils/validators';
import { useToast } from '../../hooks/useToast';

const emptyForm = {
  fullName: '', mobileNumber: '', alternateMobile: '', email: '', city: '',
  courseId: '', courseMode: '', budgetRange: '', enquirySource: '', priority: '',
};

export default function AddEnquiryDrawer({ open, onClose, onCreated }) {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      getCourses().then(setCourses).catch(() => setCourses([]));
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const validationErrors = runValidators(form, {
      fullName: [isRequired],
      mobileNumber: [isRequired, isTenDigitMobile],
      alternateMobile: [isTenDigitMobile],
      email: [isRequired, isValidEmail],
      city: [isRequired],
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const created = await createEnquiry({
        fullName: form.fullName,
        mobileNumber: form.mobileNumber,
        alternateMobile: form.alternateMobile || undefined,
        email: form.email,
        city: form.city,
        courseId: form.courseId ? Number(form.courseId) : undefined,
        courseMode: form.courseMode || undefined,
        budgetRange: form.budgetRange || undefined,
        enquirySource: form.enquirySource || undefined,
        priority: form.priority || undefined,
      });
      toast.success('Enquiry added successfully');
      onCreated?.(created);
      onClose();
    } catch (err) {
      if (err.validationErrors) setErrors(err.validationErrors);
      else toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const courseOptions = courses.map((c) => ({ value: String(c.courseId), label: c.courseName }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Enquiry"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Save Enquiry</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">Personal Details</p>
          <div className="flex flex-col gap-4">
            <Input id="fullName" label="Full Name" required value={form.fullName} onChange={setField('fullName')} error={errors.fullName} />
            <Input id="email" label="Email" type="email" required value={form.email} onChange={setField('email')} error={errors.email} />
            <Input id="mobileNumber" label="Mobile Number" required maxLength={10} value={form.mobileNumber} onChange={setField('mobileNumber')} error={errors.mobileNumber} />
            <Input id="alternateMobile" label="Alternate Mobile" maxLength={10} value={form.alternateMobile} onChange={setField('alternateMobile')} error={errors.alternateMobile} />
            <Input id="city" label="City" required value={form.city} onChange={setField('city')} error={errors.city} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">Course Requirement</p>
          <div className="flex flex-col gap-4">
            <Select id="courseId" label="Course" value={form.courseId} onChange={setField('courseId')} options={courseOptions} />
            <Select id="courseMode" label="Course Mode" value={form.courseMode} onChange={setField('courseMode')} options={COURSE_MODES} />
            <Select id="budgetRange" label="Budget Range" value={form.budgetRange} onChange={setField('budgetRange')} options={BUDGET_RANGES} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-3">Lead Information</p>
          <div className="flex flex-col gap-4">
            <Select id="enquirySource" label="Enquiry Source" value={form.enquirySource} onChange={setField('enquirySource')} options={ENQUIRY_SOURCES} />
            <Select id="priority" label="Priority" value={form.priority} onChange={setField('priority')} options={ENQUIRY_PRIORITY} />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
