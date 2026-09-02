import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../api/authApi'
import { registerAuthFailureHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('crm_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      const nextUser = { email: data.email, role: data.role }
      localStorage.setItem('crm_token', data.token)
      localStorage.setItem('crm_user', JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user')
    setUser(null)
  }, [])

  useEffect(() => {
    registerAuthFailureHandler(() => {
      localStorage.removeItem('crm_user')
      setUser(null)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useCurrentUser() {
  return useAuth().user
}
