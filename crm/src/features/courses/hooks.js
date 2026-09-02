import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { courseApi } from '../../api/courseApi'
import { parseApiError } from '../../api/client'

export const courseKeys = {
  all: ['courses'],
  detail: (id) => [...courseKeys.all, 'detail', id],
  search: (name) => [...courseKeys.all, 'search', name],
}

export function useCourses() {
  return useQuery({ queryKey: courseKeys.all, queryFn: courseApi.list })
}

export function useCourse(id) {
  return useQuery({ queryKey: courseKeys.detail(id), queryFn: () => courseApi.get(id), enabled: !!id })
}

export function useCourseSearch(name) {
  return useQuery({
    queryKey: courseKeys.search(name),
    queryFn: () => courseApi.search(name),
    enabled: !!name,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: courseApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courseKeys.all })
      toast.success('Course created')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => courseApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courseKeys.all })
      toast.success('Course updated')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: courseApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courseKeys.all })
      toast.success('Course deleted')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
