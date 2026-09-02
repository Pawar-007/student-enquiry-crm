import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { enquiryApi } from '../../api/enquiryApi'
import { parseApiError } from '../../api/client'

export const enquiryKeys = {
  all: ['enquiries'],
  my: () => [...enquiryKeys.all, 'my'],
  admin: () => [...enquiryKeys.all, 'admin'],
  unassigned: () => [...enquiryKeys.all, 'unassigned'],
  detail: (id) => [...enquiryKeys.all, 'detail', id],
  byStatus: (status) => [...enquiryKeys.all, 'status', status],
}

export function useMyEnquiries() {
  return useQuery({ queryKey: enquiryKeys.my(), queryFn: enquiryApi.my })
}

export function useAllEnquiries() {
  return useQuery({ queryKey: enquiryKeys.admin(), queryFn: enquiryApi.all })
}

export function useUnassignedEnquiries() {
  return useQuery({ queryKey: enquiryKeys.unassigned(), queryFn: enquiryApi.unassigned })
}

export function useEnquiry(id) {
  return useQuery({ queryKey: enquiryKeys.detail(id), queryFn: () => enquiryApi.get(id), enabled: !!id })
}

function useInvalidateEnquiries() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: enquiryKeys.all })
}

export function useCreateEnquiry() {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: enquiryApi.create,
    onSuccess: () => {
      invalidate()
      toast.success('Enquiry created')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUpdateEnquiryStatus() {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: ({ id, status }) => enquiryApi.updateStatus(id, status),
    onSuccess: () => {
      invalidate()
      toast.success('Status updated')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUpdateEnquiryPriority() {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: ({ id, priority }) => enquiryApi.updatePriority(id, priority),
    onSuccess: () => {
      invalidate()
      toast.success('Priority updated')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useAssignEnquiry() {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: ({ id, counsellorId }) => enquiryApi.assign(id, counsellorId),
    onSuccess: () => {
      invalidate()
      toast.success('Counsellor assigned')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
