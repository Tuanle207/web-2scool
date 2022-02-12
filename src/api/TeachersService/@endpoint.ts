const Endpoint = {
  GetTeacherById: (id: string) =>
    `/api/app/teachers/${id}`,
  GetAllTeachers: () => 
    `/api/app/teachers/paging`,
  getAllTeachersSimpleList: () => 
    `/api/app/teachers/simple-list`,
  CreateTeacher: () =>
    `/api/app/teachers`,
  UpdateTeacher: (id: string) =>
    `/api/app/teachers/${id}`,
  RemoveTeacher: (id: string) =>
    `/api/app/teachers/${id}`,
}

export default Endpoint;