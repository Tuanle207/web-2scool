const Endpoint = {
  GetGradeById: (id: string) =>
    `/api/app/grades/${id}`,
  GetAllGrades: () => 
    `/api/app/grades/paging`,
  CreateGrade: () =>
    `/api/app/grades`,
  UpdateGrade: (id: string) =>
    `/api/app/grades/${id}`,
  RemoveGrade: (id: string) =>
    `/api/app/grades/${id}`,
}

export default Endpoint;