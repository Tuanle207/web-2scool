const Endpoint = {
  GetTenantById: (id: string) => `/api/app/multitenancy/${id}`,
  GetTenants: () => `/api/app/multitenancy/paging`,
  CreateTenant: () => `/api/app/multitenancy`,
  CreateTenantWithImage: () => `/api/app/multitenancy/create-with-image`,
  RemoveTenant: (id: string) => `/api/app/multitenancy/${id}`,
  UpdateTenant: (id: string) => `/api/app/multitenancy/${id}`,
  IsNameAlreadyUsed: (name: string, tenantId?: string) => 
    `/api/app/multitenancy/is-name-already-used?name=${name}&id=${tenantId}`,
  GetDisplayNameByTenantName: (name: string) =>
    `/api/app/multitenancy/display-name-from-tenant-name?name=${name}`,
}

export default Endpoint;