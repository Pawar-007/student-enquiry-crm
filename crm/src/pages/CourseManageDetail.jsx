import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, Trash2, Layers, CalendarRange, Save } from 'lucide-react'
import { useCourse, useUpdateCourse } from '../features/courses/hooks'
import { useModulesByCourse, useCreateModule, useDeleteModule } from '../features/modules/hooks'
import { useBatchesByCourse, useCreateBatch } from '../features/batches/hooks'
import { CardSkeleton } from '../components/Skeleton'
import Button from '../components/Button'
import { Label, Input, Textarea } from '../components/Field'

export default function CourseManageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: course, isLoading } = useCourse(id)
  const updateCourse = useUpdateCourse()
  const { data: modules } = useModulesByCourse(id)
  const createModule = useCreateModule()
  const deleteModule = useDeleteModule()
  const { data: batches } = useBatchesByCourse(id)
  const createBatch = useCreateBatch()

  const courseForm = useForm()
  const moduleForm = useForm()
  const batchForm = useForm()

  if (isLoading || !course) return <div className="max-w-2xl"><CardSkeleton /></div>

  function onSaveCourse(values) {
    updateCourse.mutate({ id, payload: values })
  }
  function onAddModule(values) {
    createModule.mutate({ ...values, courseId: id }, { onSuccess: () => moduleForm.reset() })
  }
  function onAddBatch(values) {
    createBatch.mutate({ ...values, courseId: id }, { onSuccess: () => batchForm.reset() })
  }

  return (
    <div className="max-w-2xl space-y-5">
      <button onClick={() => navigate('/portal/courses/manage')} className="flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink">
        <ArrowLeft size={15} /> All courses
      </button>

      <form onSubmit={courseForm.handleSubmit(onSaveCourse)} className="rounded-lg border border-border-soft bg-surface p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-ink">Course details</h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={course.name} {...courseForm.register('name', { required: true })} />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" defaultValue={course.duration} {...courseForm.register('duration')} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} defaultValue={course.description} {...courseForm.register('description')} />
        </div>
        <Button type="submit" size="sm" loading={updateCourse.isPending}><Save size={14} className="mr-1.5" /> Save changes</Button>
      </form>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><Layers size={16} /> Modules</h2>
        <ul className="divide-y divide-border-soft">
          {(modules || []).map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium text-ink">{m.name}</span>
              <button onClick={() => deleteModule.mutate({ id: m.id, courseId: id })}>
                <Trash2 size={14} className="text-danger" />
              </button>
            </li>
          ))}
          {(modules || []).length === 0 && <p className="py-2 text-sm text-ink-faint">No modules yet.</p>}
        </ul>
        <form onSubmit={moduleForm.handleSubmit(onAddModule)} className="flex gap-2">
          <Input placeholder="Module name" {...moduleForm.register('name', { required: true })} />
          <Button type="submit" size="sm" loading={createModule.isPending}><Plus size={14} /></Button>
        </form>
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-6 shadow-card space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink"><CalendarRange size={16} /> Batches</h2>
        <ul className="divide-y divide-border-soft">
          {(batches || []).map((b) => (
            <li key={b.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium text-ink">{b.name || b.batchName}</span>
              <span className="num text-ink-faint">{b.startDate} → {b.endDate}</span>
            </li>
          ))}
          {(batches || []).length === 0 && <p className="py-2 text-sm text-ink-faint">No batches yet.</p>}
        </ul>
        <form onSubmit={batchForm.handleSubmit(onAddBatch)} className="grid grid-cols-3 gap-2">
          <Input placeholder="Batch name" {...batchForm.register('name', { required: true })} />
          <Input type="date" {...batchForm.register('startDate', { required: true })} />
          <Input type="date" {...batchForm.register('endDate', { required: true })} />
          <Button type="submit" size="sm" className="col-span-3" loading={createBatch.isPending}>
            <Plus size={14} className="mr-1.5" /> Add batch
          </Button>
        </form>
      </div>
    </div>
  )
}
