import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { paymentApi } from '../../api/paymentApi'
import { parseApiError } from '../../api/client'
import { enrollmentKeys } from '../enrollments/hooks'

export const paymentKeys = {
  all: ['payments'],
  byEnrollment: (id) => [...paymentKeys.all, 'enrollment', id],
  revenue: () => [...paymentKeys.all, 'revenue'],
}

export function usePaymentsByEnrollment(enrollmentId) {
  return useQuery({
    queryKey: paymentKeys.byEnrollment(enrollmentId),
    queryFn: () => paymentApi.byEnrollment(enrollmentId),
    enabled: !!enrollmentId,
  })
}

export function useRevenue() {
  return useQuery({ queryKey: paymentKeys.revenue(), queryFn: paymentApi.revenue })
}

export function useAddPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: paymentApi.create,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: paymentKeys.byEnrollment(variables.enrollmentId) })
      qc.invalidateQueries({ queryKey: enrollmentKeys.detail(variables.enrollmentId) })
      toast.success('Payment recorded')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
