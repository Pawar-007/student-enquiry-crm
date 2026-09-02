import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { followupApi } from '../../api/followupApi'
import { parseApiError } from '../../api/client'
import { enquiryKeys } from '../enquiries/hooks'

export const followupKeys = {
  all: ['followups'],
  today: () => [...followupKeys.all, 'today'],
  byEnquiry: (id) => [...followupKeys.all, 'enquiry', id],
  byCounsellor: (id) => [...followupKeys.all, 'counsellor', id],
}

export function useTodayFollowups() {
  return useQuery({ queryKey: followupKeys.today(), queryFn: followupApi.today })
}

export function useFollowupsByEnquiry(enquiryId) {
  return useQuery({
    queryKey: followupKeys.byEnquiry(enquiryId),
    queryFn: () => followupApi.byEnquiry(enquiryId),
    enabled: !!enquiryId,
  })
}

export function useCreateFollowup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: followupApi.create,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: followupKeys.all })
      qc.invalidateQueries({ queryKey: enquiryKeys.detail(variables.enquiryId) })
      toast.success('Follow-up scheduled')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useCompleteFollowup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, outcome, remarks }) => followupApi.complete(id, outcome, remarks),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: followupKeys.all })
      qc.invalidateQueries({ queryKey: enquiryKeys.all })
      toast.success('Follow-up marked complete')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
