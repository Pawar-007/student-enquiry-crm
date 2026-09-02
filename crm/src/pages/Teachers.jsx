import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { useTeachers, useCreateTeacher, useDeleteTeacher } from '../features/teachers/hooks'
import { Table, THead, Th, Td, Tr } from '../components/Table'
import { TableSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Input, FieldError } from '../components/Field'

function CreateTeacherModal({ open, onClose }) {
  const create = useCreateTeacher()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function onSubmit(values) {
    create.mutate(values, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add teacher">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: true })} />
          <FieldError>{errors.name && 'Name is required'}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
          <FieldError>{errors.email && 'Email is required'}</FieldError>
        </div>
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" {...register('specialization')} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Add teacher</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Teachers() {
  const { data: teachers, isLoading } = useTeachers()
  const deleteTeacher = useDeleteTeacher()
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Teachers</h1>
          <p className="text-sm text-ink-faint mt-0.5">Faculty available across your courses.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} className="mr-1.5" /> Add teacher</Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border-soft bg-surface"><TableSkeleton /></div>
      ) : (teachers || []).length === 0 ? (
        <EmptyState icon={GraduationCap} title="No teachers yet" description="Add faculty to assign them to batches later." action={<Button size="sm" onClick={() => setOpen(true)}>Add teacher</Button>} />
      ) : (
        <Table>
          <THead>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Specialization</Th>
            <Th className="text-right">Actions</Th>
          </THead>
          <tbody>
            {teachers.map((t) => (
              <Tr key={t.id}>
                <Td className="font-semibold">{t.name}</Td>
                <Td className="text-ink-soft">{t.email}</Td>
                <Td className="text-ink-soft">{t.specialization || '—'}</Td>
                <Td>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => window.confirm(`Remove ${t.name}?`) && deleteTeacher.mutate(t.id)}>
                      <Trash2 size={15} className="text-danger" />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <CreateTeacherModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
