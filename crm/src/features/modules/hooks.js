import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { moduleApi } from '../../api/moduleApi'
import { parseApiError } from '../../api/client'

export const moduleKeys = { byCourse: (id) => ['modules', 'course', id] }

export function useModulesByCourse(courseId) {
  return useQuery({
    queryKey: moduleKeys.byCourse(courseId),
    queryFn: () => moduleApi.byCourse(courseId),
    enabled: !!courseId,
  })
}

export function useCreateModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: moduleApi.create,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: moduleKeys.byCourse(variables.courseId) })
      toast.success('Module added')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useDeleteModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => moduleApi.remove(id),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: moduleKeys.byCourse(variables.courseId) })
      toast.success('Module removed')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
