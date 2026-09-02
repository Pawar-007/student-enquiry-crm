import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateEnquiry } from '../features/enquiries/hooks'
import { useCourses } from '../features/courses/hooks'
import { Label, Input, Select, FieldError } from '../components/Field'
import Button from '../components/Button'
import { parseApiError } from '../api/client'

const SOURCES = ['Walk-in', 'Phone Call', 'Website']
const MODES = ['Online', 'Offline']
const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', 'Above ₹50,000']

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  mobileNumber: z.string().min(10, 'Enter a valid mobile number'),
  alternateMobile: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  courseId: z.string().min(1, 'Select a course'),
  courseMode: z.string().min(1, 'Select a mode'),
  budgetRange: z.string().min(1, 'Select a budget range'),
  enquirySource: z.string().min(1, 'Select a source'),
})

export default function NewEnquiry() {
  const navigate = useNavigate()
  const { data: courses } = useCourses()
  const createEnquiry = useCreateEnquiry()
  const [apiFieldErrors, setApiFieldErrors] = useState({})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { enquirySource: 'Walk-in' } })

  const source = watch('enquirySource')

  function onSubmit(values) {
    setApiFieldErrors({})
    const payload = { ...values, alternateMobile: values.alternateMobile || undefined, email: values.email || undefined }
    createEnquiry.mutate(payload, {
      onSuccess: (created) => navigate(`/portal/enquiries/${created.id}`),
      onError: (err) => {
        const { validationErrors } = parseApiError(err)
        if (validationErrors) setApiFieldErrors(validationErrors)
      },
    })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">New enquiry</h1>
        <p className="text-sm text-ink-faint mt-0.5">
          {source === 'Walk-in' ? 'Walk-ins assign to you automatically.' : 'This lead lands in the Admin unassigned queue.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border border-border-soft bg-surface p-6 shadow-card">
        <div>
          <Label htmlFor="enquirySource">Source</Label>
          <Select id="enquirySource" {...register('enquirySource')}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <FieldError>{errors.enquirySource?.message}</FieldError>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" {...register('fullName')} />
            <FieldError>{errors.fullName?.message || apiFieldErrors.fullName}</FieldError>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} />
            <FieldError>{errors.city?.message || apiFieldErrors.city}</FieldError>
          </div>
          <div>
            <Label htmlFor="mobileNumber">Mobile number</Label>
            <Input id="mobileNumber" {...register('mobileNumber')} />
            <FieldError>{errors.mobileNumber?.message || apiFieldErrors.mobileNumber}</FieldError>
          </div>
          <div>
            <Label htmlFor="alternateMobile">Alternate mobile (optional)</Label>
            <Input id="alternateMobile" {...register('alternateMobile')} />
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" {...register('email')} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="courseId">Course</Label>
            <Select id="courseId" {...register('courseId')}>
              <option value="">Select a course</option>
              {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <FieldError>{errors.courseId?.message || apiFieldErrors.courseId}</FieldError>
          </div>
          <div>
            <Label htmlFor="courseMode">Mode</Label>
            <Select id="courseMode" {...register('courseMode')}>
              <option value="">Select mode</option>
              {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
            <FieldError>{errors.courseMode?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="budgetRange">Budget range</Label>
            <Select id="budgetRange" {...register('budgetRange')}>
              <option value="">Select budget</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <FieldError>{errors.budgetRange?.message}</FieldError>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={createEnquiry.isPending}>Create enquiry</Button>
        </div>
      </form>
    </div>
  )
}
