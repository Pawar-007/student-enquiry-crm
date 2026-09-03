import { useMutation, useQuery } from '@tanstack/react-query'
import { getPublicCourses, getPublicCourseById, submitPublicEnquiry } from '../../api/publicApi'

export const publicKeys = {
  courses: ['public', 'courses'],
  course: (id) => ['public', 'courses', id],
}

export function usePublicCourses() {
  return useQuery({ queryKey: publicKeys.courses, queryFn: getPublicCourses })
}

export function usePublicCourse(id) {
  return useQuery({ queryKey: publicKeys.course(id), queryFn: () => getPublicCourseById(id), enabled: !!id })
}

// No cache invalidation needed — a submitted enquiry doesn't affect any
// public query the visitor can see, and the confirmation is handled by
// the caller via onSuccess/onError.
export function useSubmitPublicEnquiry() {
  return useMutation({ mutationFn: submitPublicEnquiry })
}
