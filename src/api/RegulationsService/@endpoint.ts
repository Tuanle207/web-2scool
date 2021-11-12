const Endpoint = {
  GetRegulationSimpleList: () => `/api/app/regulation/simple-list`,
  GetCriteriaSimpleList: () => `/api/app/criteria/simple-list`,
  GetAllRegulations: () => `/api/app/regulation/paging`,
  CreateRegulation: () => `/api/app/regulation`,
  UpdateRegulation: (id: string) => `/api/app/regulation/${id}`,
  DeleteRegulation: (id: string) => `/api/app/regulation/${id}`,
}

export default Endpoint;