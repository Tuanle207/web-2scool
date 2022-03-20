const Endpoint = {
  GetGradeById: (id: string) =>
    `/api/app/grades/${id}`,
  GetAllGrades: () => 
    `/api/app/grades/paging`,
  GetGradesForSimpleList: () => 
  `/api/app/grades/simple-list`,
  CreateGrade: () =>
    `/api/app/grades`,
  UpdateGrade: (id: string) =>
    `/api/app/grades/${id}`,
  DeleteGradeById: (id: string) =>
    `/api/app/grades/${id}`,
  IsNameAlreadyUsed: (name: string, id: string) =>
    `/api/app/grades/is-name-already-used?name=${name}&id=${id}`,
}

export default Endpoint;