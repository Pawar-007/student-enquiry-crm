import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { teacherApi } from '../../api/teacherApi'
import { parseApiError } from '../../api/client'

export const teacherKeys = { all: ['teachers'] }

export function useTeachers() {
  return useQuery({ queryKey: teacherKeys.all, queryFn: teacherApi.list })
}

export function useCreateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teacherApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.all })
      toast.success('Teacher added')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUpdateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => teacherApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.all })
      toast.success('Teacher updated')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useDeleteTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teacherApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teacherKeys.all })
      toast.success('Teacher removed')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
