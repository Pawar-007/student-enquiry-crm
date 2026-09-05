import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getPublicCourses } from '../../api/courseApi';
import { submitPublicEnquiry } from '../../api/enquiryApi';
import { useApi } from '../../hooks/useApi';
import { COURSE_MODES, BUDGET_RANGES } from '../../constants/enums';
import { Input, Select } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { isRequired, isValidEmail, isTenDigitMobile, runValidators } from '../../utils/validators';

const initialForm = (state) => ({
  fullName: '',
  mobileNumber: '',
  alternateMobile: '',
  email: '',
  city: '',
  courseId: state?.courseId ? String(state.courseId) : '',
  courseMode: '',
  budgetRange: '',
});

export default function Enquiry() {
  const location = useLocation();
  const { data: courses } = useApi(getPublicCourses, []);
  const [form, setForm] = useState(() => initialForm(location.state));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const courseOptions = (courses || []).map((c) => ({ value: String(c.courseId), label: c.courseName }));

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const schema = {
    fullName: [isRequired],
    mobileNumber: [isRequired, isTenDigitMobile],
    alternateMobile: [isTenDigitMobile],
    email: [isRequired, isValidEmail],
    city: [isRequired],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = runValidators(form, schema);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      // The public visitor never sets enquirySource, priority, or counsellor —
      // the backend derives those automatically from this endpoint.
      await submitPublicEnquiry({
        fullName: form.fullName,
        mobileNumber: form.mobileNumber,
        alternateMobile: form.alternateMobile || undefined,
        email: form.email,
        city: form.city,
        courseId: form.courseId ? Number(form.courseId) : undefined,
        courseMode: form.courseMode || undefined,
        budgetRange: form.budgetRange || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else {
        setApiError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-5 sm:px-8 py-24 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)]">Thank you! Your enquiry has been submitted successfully.</h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          A counsellor will reach out to you shortly to help you find the right fit.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)]">Submit an enquiry</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        Tell us a bit about what you're looking for and a counsellor will get in touch.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-6">
        {apiError && (
          <div role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-sm px-4 py-3">
            {apiError}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <Input id="fullName" label="Full Name" required value={form.fullName} onChange={setField('fullName')} error={errors.fullName} placeholder="Jane Doe" />
          <Input id="email" label="Email" type="email" required value={form.email} onChange={setField('email')} error={errors.email} placeholder="jane@example.com" />
          <Input id="mobileNumber" label="Mobile Number" required value={form.mobileNumber} onChange={setField('mobileNumber')} error={errors.mobileNumber} placeholder="10-digit number" maxLength={10} />
          <Input id="alternateMobile" label="Alternate Mobile" value={form.alternateMobile} onChange={setField('alternateMobile')} error={errors.alternateMobile} placeholder="Optional" maxLength={10} />
          <Input id="city" label="City" required value={form.city} onChange={setField('city')} error={errors.city} placeholder="Pune" />
          <Select id="courseId" label="Course" value={form.courseId} onChange={setField('courseId')} error={errors.courseId} options={courseOptions} placeholder="Select a course" />
          <Select id="courseMode" label="Course Mode" value={form.courseMode} onChange={setField('courseMode')} error={errors.courseMode} options={COURSE_MODES} placeholder="Select mode" />
          <Select id="budgetRange" label="Budget Range" value={form.budgetRange} onChange={setField('budgetRange')} error={errors.budgetRange} options={BUDGET_RANGES} placeholder="Select budget" />
        </div>

        <Button type="submit" size="lg" variant="primary" loading={submitting} className="self-start">
          Submit Enquiry
        </Button>
      </form>
    </div>
  );
}
