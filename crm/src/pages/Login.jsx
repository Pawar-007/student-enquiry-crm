import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { parseApiError } from '../api/client'
import { Label, Input, FieldError } from '../components/Field'
import Button from '../components/Button'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setApiError('')
    try {
      const user = await login(values.email, values.password)
      const redirectTo = location.state?.from?.pathname
      if (redirectTo) navigate(redirectTo, { replace: true })
      else navigate('/portal', { replace: true })
    } catch (err) {
      setApiError(parseApiError(err).message)
    }
  }

  return (
    <div className="rounded-lg bg-surface p-8 shadow-pop">
      <div className="mb-7 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-500 text-white font-bold">L</div>
        <div>
          <p className="text-[15px] font-bold leading-tight text-ink">Ledger</p>
          <p className="text-xs text-ink-faint leading-tight">Admission CRM</p>
        </div>
      </div>

      <h1 className="text-lg font-bold text-ink">Sign in</h1>
      <p className="mt-1 text-sm text-ink-faint">Enter your credentials to reach your queue.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@institute.com" error={errors.email} {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" error={errors.password} {...register('password')} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        {apiError && (
          <div className="rounded-md bg-hot-bg px-3 py-2 text-sm font-medium text-hot">{apiError}</div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  )
}
