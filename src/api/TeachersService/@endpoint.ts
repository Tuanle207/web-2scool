const Endpoint = {
  GetTeacherById: (id: string) =>
    `/api/app/teachers/${id}`,
  GetAllTeachers: () => 
    `/api/app/teachers/paging`,
  getAllTeachersSimpleList: () => 
    `/api/app/teachers/simple-list`,
  getFormableTeachers: () =>
    `/api/app/teachers/formable-teachers`,
  CreateTeacher: () =>
    `/api/app/teachers`,
  UpdateTeacher: (id: string) =>
    `/api/app/teachers/${id}`,
  RemoveTeacher: (id: string) =>
    `/api/app/teachers/${id}`,
  IsAlreadyFormTeacher: (teacherId: string, classId: string) =>
    `/api/app/teachers/is-already-form-teacher?teacherId=${teacherId}&classId=${classId}`,
}

export default Endpoint;