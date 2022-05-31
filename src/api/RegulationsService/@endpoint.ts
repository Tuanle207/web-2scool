const Endpoint = {
  GetRegulationSimpleList: () => `/api/app/regulation/simple-list`,
  GetAllRegulations: () => `/api/app/regulation/paging`,
  GetRegulation: (id: string) => `/api/app/regulation/${id}`,
  CreateRegulation: () => `/api/app/regulation`,
  UpdateRegulation: (id: string) => `/api/app/regulation/${id}`,
  DeleteRegulation: (id: string) => `/api/app/regulation/${id}`,

  GetAllCriterias: () => `/api/app/criterias/paging`,
  GetCriteriaSimpleList: () => `/api/app/criterias/simple-list`,
  GetCriteria: (id: string) => `/api/app/criterias/${id}`,
  CreateCriteria: () => `/api/app/criterias`,
  UpdateCriteria: (id: string) => `/api/app/criterias/${id}`,
  DeleteCriteria: (id: string) => `/api/app/criterias/${id}`,
}

export default Endpoint;