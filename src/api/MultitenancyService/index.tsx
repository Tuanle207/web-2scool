

import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Tenant, Util } from '../../interfaces';

const getTenantById = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Tenant.SingleTenantDto>(Endpoint.GetTenantById(id));
  return result;
};

const getTenants = async (input: Util.PagingFilter) => {
  const apiService = await getApiService();
  const result = await apiService.post<Util.PagingModel<Tenant.TenantDto>>(Endpoint.GetTenants(), input);
  return result;
};

const createTenant = async (user: Tenant.CreateTenantDto) => {
  const apiService = await getApiService();
  const result = await apiService.post(Endpoint.CreateTenant(), user);
  return result;
};

const createTenantWithImage = async (user: Tenant.CreateTenantDto, image: File) => {
  const apiService = await getApiService();
  const obj = {...user, image};
  const result = await apiService.post(Endpoint.CreateTenantWithImage(), obj);
  return result;
};

const updateTenant = async ({id, data}: {id: string, data: Tenant.UpdateTenantDto}) => {
  const apiService = await getApiService();
  const result = await apiService.put(Endpoint.UpdateTenant(id), data);
  return result;
};


const deleteTenantById = async (id: string) => {
  const apiService = await getApiService();
  await apiService.delete(Endpoint.RemoveTenant(id));
};

const isTenantNameAlreadyUsed = async (tenantName: string, tenantId: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.IsNameAlreadyUsed(tenantName, tenantId));
  return result;
};

const getDisplayNameByTenantName = async (tenantName: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<string>(Endpoint.GetDisplayNameByTenantName(tenantName));
  return result;
};

export const MultitenancyService = {
  getTenantById,
  getTenants,
  createTenant,
  updateTenant,
  deleteTenantById,
  isTenantNameAlreadyUsed,
  getDisplayNameByTenantName,
  createTenantWithImage,
};