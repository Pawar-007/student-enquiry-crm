import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-4xl font-bold text-ink">404</p>
      <p className="mt-2 text-sm text-ink-faint">This page doesn't exist.</p>
      <Link to="/" className="mt-4 text-sm font-semibold text-primary-600 hover:underline">Go home</Link>
    </div>
  )
}
