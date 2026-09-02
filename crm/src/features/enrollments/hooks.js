import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { enrollmentApi } from '../../api/enrollmentApi'
import { parseApiError } from '../../api/client'
import { enquiryKeys } from '../enquiries/hooks'

export const enrollmentKeys = {
  all: ['enrollments'],
  detail: (id) => [...enrollmentKeys.all, 'detail', id],
  byStudent: (studentId) => [...enrollmentKeys.all, 'student', studentId],
}

export function useEnrollment(id) {
  return useQuery({ queryKey: enrollmentKeys.detail(id), queryFn: () => enrollmentApi.get(id), enabled: !!id })
}

export function useEnrollmentsByStudent(studentId) {
  return useQuery({
    queryKey: enrollmentKeys.byStudent(studentId),
    queryFn: () => enrollmentApi.byStudent(studentId),
    enabled: !!studentId,
  })
}

export function useConfirmAdmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: enrollmentApi.confirmAdmission,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: enrollmentKeys.all })
      qc.invalidateQueries({ queryKey: enquiryKeys.detail(variables.enquiryId) })
      qc.invalidateQueries({ queryKey: enquiryKeys.all })
      toast.success('Admission confirmed')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUpdateEnrollmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => enrollmentApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: enrollmentKeys.detail(variables.id) })
      toast.success('Enrollment status updated')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
