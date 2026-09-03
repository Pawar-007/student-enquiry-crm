import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, ArrowRight, PhoneCall } from 'lucide-react'
import { usePublicCourses, useSubmitPublicEnquiry } from '../../features/public/hooks'
import { Label, Input, Select, FieldError } from '../../components/Field'
import Button from '../../components/Button'

const MODES = ['Online', 'Offline']
const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', 'Above ₹50,000']

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  alternateMobile: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10}$/.test(v), 'Enter a valid 10-digit mobile number'),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Enter a valid email'),
  city: z.string().min(1, 'City is required'),
  courseId: z.string().min(1, 'Please select a course'),
  courseMode: z.string().min(1, 'Please select a mode'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
})

function SuccessScreen({ onReset }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Thanks — we've got your enquiry!</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Our team will reach out to you within 24 hours to help you take the next step. Keep an eye on your phone
        and inbox.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-ink-faint">
        <PhoneCall size={14} /> In a hurry? Call us at +91 98765 43210
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button as={Link} to="/courses" variant="secondary">Browse more courses</Button>
        <Button as={Link} to="/">Back to home</Button>
      </div>
    </div>
  )
}

export default function ApplyForm() {
  const [searchParams] = useSearchParams()
  const preselectedCourseId = searchParams.get('courseId') || ''
  const { data: courses, isLoading: coursesLoading } = usePublicCourses()
  const submitEnquiry = useSubmitPublicEnquiry()
  const [submitted, setSubmitted] = useState(false)
  const [apiFieldErrors, setApiFieldErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { courseId: preselectedCourseId, courseMode: 'Offline', budgetRange: '' },
  })

  useEffect(() => {
    if (preselectedCourseId) setValue('courseId', preselectedCourseId)
  }, [preselectedCourseId, setValue])

  function onSubmit(values) {
    setApiError('')
    setApiFieldErrors({})
    const payload = {
      ...values,
      alternateMobile: values.alternateMobile || undefined,
      email: values.email || undefined,
    }
    submitEnquiry.mutate(payload, {
      onSuccess: () => {
        setSubmitted(true)
        reset()
      },
      onError: (err) => {
        const data = err?.response?.data
        if (data?.validationErrors) setApiFieldErrors(data.validationErrors)
        setApiError(data?.message || 'Something went wrong submitting your enquiry. Please try again.')
      },
    })
  }

  if (submitted) return <SuccessScreen />

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 lg:px-8">
      <div className="max-w-lg">
        <h1 className="font-display text-3xl font-semibold text-ink">Apply now</h1>
        <p className="mt-2 text-sm text-ink-faint">
          Tell us a little about yourself and we'll match you with the right counsellor — no account needed.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-2xl border border-border-soft bg-surface p-6 shadow-card sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full name *</Label>
            <Input id="fullName" placeholder="Your full name" {...register('fullName')} error={errors.fullName} />
            <FieldError>{errors.fullName?.message || apiFieldErrors.fullName}</FieldError>
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input id="city" placeholder="Your city" {...register('city')} error={errors.city} />
            <FieldError>{errors.city?.message || apiFieldErrors.city}</FieldError>
          </div>
          <div>
            <Label htmlFor="mobileNumber">Mobile number *</Label>
            <Input id="mobileNumber" placeholder="10-digit mobile number" inputMode="numeric" {...register('mobileNumber')} error={errors.mobileNumber} />
            <FieldError>{errors.mobileNumber?.message || apiFieldErrors.mobileNumber}</FieldError>
          </div>
          <div>
            <Label htmlFor="alternateMobile">Alternate mobile</Label>
            <Input id="alternateMobile" placeholder="Optional" inputMode="numeric" {...register('alternateMobile')} error={errors.alternateMobile} />
            <FieldError>{errors.alternateMobile?.message || apiFieldErrors.alternateMobile}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Optional" {...register('email')} error={errors.email} />
            <FieldError>{errors.email?.message || apiFieldErrors.email}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="courseId">Course *</Label>
            <Select id="courseId" {...register('courseId')} error={errors.courseId} disabled={coursesLoading}>
              <option value="">Select a course</option>
              {(courses || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <FieldError>{errors.courseId?.message || apiFieldErrors.courseId}</FieldError>
          </div>

          <div className="sm:col-span-2">
            <Label>Course mode *</Label>
            <div className="flex gap-4">
              {MODES.map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm text-ink-soft">
                  <input type="radio" value={m} {...register('courseMode')} className="accent-primary-500" />
                  {m}
                </label>
              ))}
            </div>
            <FieldError>{errors.courseMode?.message || apiFieldErrors.courseMode}</FieldError>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="budgetRange">Budget range *</Label>
            <Select id="budgetRange" {...register('budgetRange')} error={errors.budgetRange}>
              <option value="">Select a budget range</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <FieldError>{errors.budgetRange?.message || apiFieldErrors.budgetRange}</FieldError>
          </div>
        </div>

        {apiError && (
          <div className="rounded-md bg-hot-bg px-3 py-2 text-sm font-medium text-hot">{apiError}</div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={submitEnquiry.isPending}>
          Submit enquiry <ArrowRight size={17} className="ml-2" />
        </Button>
        <p className="text-center text-xs text-ink-faint">
          No account or password needed — we'll reach out using the details above.
        </p>
      </form>
    </div>
  )
}
