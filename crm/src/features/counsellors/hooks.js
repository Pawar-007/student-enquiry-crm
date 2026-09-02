import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi } from '../../api/userApi'
import { parseApiError } from '../../api/client'

export const counsellorKeys = { all: ['counsellors'], active: ['counsellors', 'active'] }

export function useCounsellors() {
  return useQuery({ queryKey: counsellorKeys.all, queryFn: userApi.listCounsellors })
}

export function useActiveCounsellors() {
  return useQuery({ queryKey: counsellorKeys.active, queryFn: userApi.listActiveCounsellors })
}

export function useCreateCounsellor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: counsellorKeys.all })
      toast.success('Counsellor account created')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useBlockCounsellor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.block,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: counsellorKeys.all })
      toast.success('Counsellor blocked')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}

export function useUnblockCounsellor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.unblock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: counsellorKeys.all })
      toast.success('Counsellor unblocked')
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })
}
