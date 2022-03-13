const Endpoint = {
  GetClassById: (id: string) =>
    `/api/app/classes/${id}`,
  GetAllClasss: () => 
    `/api/app/classes/paging`,
  GetClassForSimpleList: () => 
    `/api/app/classes/simple-list`,
  CreateClass: () =>
    `/api/app/classes`,
  UpdateClass: (id: string) =>
    `/api/app/classes/${id}`,
  RemoveClass: (id: string) =>
    `/api/app/classes/${id}`,
  IsNameAlreadyUsed: (id: string, name: string) =>
    `/api/app/classes/is-name-already-used?id=${id}&name=${name}`,
}

export default Endpoint;