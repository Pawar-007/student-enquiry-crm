import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, Settings2, Trash2 } from 'lucide-react'
import { useCourses, useCreateCourse, useDeleteCourse } from '../features/courses/hooks'
import { Table, THead, Th, Td, Tr } from '../components/Table'
import { TableSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Input, Textarea, FieldError } from '../components/Field'

function CreateCourseModal({ open, onClose }) {
  const create = useCreateCourse()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function onSubmit(values) {
    create.mutate(values, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add course">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Course name</Label>
          <Input id="name" {...register('name', { required: true })} />
          <FieldError>{errors.name && 'Course name is required'}</FieldError>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" placeholder="e.g. 12 weeks" {...register('duration')} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register('description')} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Add course</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function CoursesManage() {
  const navigate = useNavigate()
  const { data: courses, isLoading } = useCourses()
  const deleteCourse = useDeleteCourse()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Manage courses</h1>
          <p className="text-sm text-ink-faint mt-0.5">Create courses, then add modules and batches to each.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus size={15} className="mr-1.5" /> Add course</Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border-soft bg-surface"><TableSkeleton /></div>
      ) : (courses || []).length === 0 ? (
        <EmptyState
          icon={Settings2}
          title="No courses yet"
          description="Add your first course to start receiving enquiries against it."
          action={<Button size="sm" onClick={() => setCreateOpen(true)}>Add course</Button>}
        />
      ) : (
        <Table>
          <THead>
            <Th>Name</Th>
            <Th>Duration</Th>
            <Th>Description</Th>
            <Th className="text-right">Actions</Th>
          </THead>
          <tbody>
            {courses.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold">{c.name}</Td>
                <Td className="text-ink-soft">{c.duration || '—'}</Td>
                <Td className="text-ink-soft max-w-xs truncate">{c.description || '—'}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/portal/courses/manage/${c.id}`)}>
                      Manage
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.confirm(`Delete ${c.name}?`) && deleteCourse.mutate(c.id)}
                    >
                      <Trash2 size={15} className="text-danger" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <CreateCourseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
