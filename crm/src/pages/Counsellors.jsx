import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Users, ShieldOff, ShieldCheck } from 'lucide-react'
import { useCounsellors, useCreateCounsellor, useBlockCounsellor, useUnblockCounsellor } from '../features/counsellors/hooks'
import { Table, THead, Th, Td, Tr } from '../components/Table'
import { TableSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Label, Input, FieldError } from '../components/Field'
import Pill from '../components/Badge'

function CreateCounsellorModal({ open, onClose }) {
  const create = useCreateCounsellor()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function onSubmit(values) {
    create.mutate({ ...values, role: 'Counsellor' }, { onSuccess: () => { reset(); onClose() } })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add counsellor">
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
          <Label htmlFor="password">Temporary password</Label>
          <Input id="password" type="password" {...register('password', { required: true, minLength: 6 })} />
          <FieldError>{errors.password && 'Minimum 6 characters'}</FieldError>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Create account</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Counsellors() {
  const { data: counsellors, isLoading } = useCounsellors()
  const block = useBlockCounsellor()
  const unblock = useUnblockCounsellor()
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Counsellors</h1>
          <p className="text-sm text-ink-faint mt-0.5">Manage counsellor accounts and access.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} className="mr-1.5" /> Add counsellor</Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border-soft bg-surface"><TableSkeleton /></div>
      ) : (counsellors || []).length === 0 ? (
        <EmptyState icon={Users} title="No counsellors yet" description="Add your team to start assigning leads." action={<Button size="sm" onClick={() => setOpen(true)}>Add counsellor</Button>} />
      ) : (
        <Table>
          <THead>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </THead>
          <tbody>
            {counsellors.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold">{c.name}</Td>
                <Td className="text-ink-soft">{c.email}</Td>
                <Td>
                  <Pill className={c.blocked ? 'bg-hot-bg text-hot' : 'bg-primary-50 text-primary-600'}>
                    {c.blocked ? 'Blocked' : 'Active'}
                  </Pill>
                </Td>
                <Td>
                  <div className="flex justify-end">
                    {c.blocked ? (
                      <Button size="sm" variant="secondary" onClick={() => unblock.mutate(c.id)}>
                        <ShieldCheck size={14} className="mr-1.5" /> Unblock
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => window.confirm(`Block ${c.name}?`) && block.mutate(c.id)}>
                        <ShieldOff size={14} className="mr-1.5 text-danger" /> Block
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <CreateCounsellorModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
