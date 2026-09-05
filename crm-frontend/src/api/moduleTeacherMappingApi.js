import apiClient from './apiClient';

// { moduleId, teacherId }
export function assignTeacherToModule(payload) {
  return apiClient.post('/module-teacher-mapping', payload).then((res) => res.data);
}

export function removeModuleTeacherMapping(id) {
  return apiClient.delete(`/module-teacher-mapping/${id}`).then((res) => res.data);
}

export function getMappingsByModule(moduleId) {
  return apiClient.get(`/module-teacher-mapping/module/${moduleId}`).then((res) => res.data);
}

export function getMappingsByTeacher(teacherId) {
  return apiClient.get(`/module-teacher-mapping/teacher/${teacherId}`).then((res) => res.data);
}
