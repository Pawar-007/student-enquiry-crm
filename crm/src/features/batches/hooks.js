import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { batchApi } from '../../api/batchApi'
import { parseApiError } from '../../api/client'

export const batchKeys = { byCourse: (id) => ['batches', 'course', id] }

export function useBatchesByCourse(courseId) {
  return useQuery({
    queryKey: batchKeys.byCourse(courseId),
    queryFn: () => batchApi.byCourse(courseId),
    enabled: !!courseId,
  })
}

export function useCreateBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: batchApi.create,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: batchKeys.byCourse(variables.courseId) })
      toast.success('Batch added')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
