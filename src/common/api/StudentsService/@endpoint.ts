const Endpoint = {
  GetStudentById: (id: string) =>
    `/api/app/students/${id}`,
  GetAllStudents: () => 
    `/api/app/students/paging`,
  GetStudentForSimpleList: () => 
    `/api/app/students/simple-list`,
  CreateStudent: () =>
    `/api/app/students`,
  UpdateStudent: (id: string) =>
    `/api/app/students/${id}`,
  RemoveStudent: (id: string) =>
    `/api/app/students/${id}`,
}

export default Endpoint;