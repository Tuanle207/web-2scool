import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Identity, Util } from '../../interfaces';

const getUsers = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Identity.UserDto>>(Endpoint.GetUsers());
    var userIds = result.items.map(el => el.id);
    const roles = await Promise.all(
      userIds.map((id: string) => apiService.get<Identity.UserRoleResDto>(Endpoint.GetUserRoleById(id)))
    );
    result.items.forEach((user, index) => {
      result.items[index].roles = roles[index].items;
    })
    return result;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id: string) =>  {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Identity.UserDto>(Endpoint.GetUserById(id));
    const role = await apiService.get<Identity.UserRoleResDto>(Endpoint.GetUserRoleById(id));
    result.roles = role.items;
    return result;
  } catch (error) {
    throw error;
  }
};

const createUser = async (user: Identity.CreateUpdateUserDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateUser(), user);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateUser = async ({id, data}: {id: string, data: Identity.CreateUpdateUserDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateUser(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};


const deleteUserById = async (id: string) =>  {
  try {
    const apiService = await getApiService();
    await apiService.delete(Endpoint.RemoveUser(id));
  } catch (error) {
    throw error;
  }
};

const getUsersForTaskAssignment = async (classId?: string) =>  {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Identity.UserForTaskAssignmentDto>>
      (Endpoint.GetUsersForTaskAssignment(classId));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAssignableRoles = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Identity.UserRoleResDto>(Endpoint.GetAssignableRoles());
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllRoles = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Identity.RoleDto>>(Endpoint.GetAllRoles());
    return result;
  } catch (error) {
    throw error;
  }
};

const createRole = async (data: Identity.CreateUpdateRoleDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateRole(), { ...data, isDefault: false, isPublic: true });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateRole = async ({id, data}: {id: string, data: Identity.CreateUpdateRoleDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateRole(id), { ...data, isDefault: false, isPublic: true });
    return result;
  } catch (error) {
    throw error;
  }
};

const getPermissions = async (data: Identity.PermissionProvider) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Identity.PermissionResDto>(Endpoint.GetPermissions(), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateRolePermissions = async ({provider, data}: 
  { provider: Identity.PermissionProvider; data: Identity.UpdateRolePermissionDto}) => {
  try {
    const apiService = await getApiService();
    const queryString = `?providerName=${provider.providerName}&providerKey=${provider.providerKey}`;
    const result = await apiService.put(Endpoint.UpdatePermissions() + queryString, data);
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteRoleById = async (id: string) => {
  try {
    const apiService = await getApiService();
    await apiService.delete(Endpoint.RemoveRole(id));
  } catch (error) {
    throw error;
  }
};


const IdentityService = {
  getUsers,
  getAssignableRoles,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
  getAllRoles,
  createRole,
  updateRole,
  getPermissions,
  updateRolePermissions,
  getUsersForTaskAssignment,
  deleteRoleById
};

export default IdentityService;