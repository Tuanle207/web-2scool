import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Identity, Util } from '../../interfaces';

const getUsers = async (input: Util.PagingFilter) => {
  const apiService = await getApiService();
  const result = await apiService.post<Util.PagingModel<Identity.UserDto>>(Endpoint.GetUsers(), input);
  return result;
};

const getUserById = async (id: string) =>  {
  const apiService = await getApiService();
  const result = await apiService.get<Identity.UserDto>(Endpoint.GetUserById(id));
  const role = await apiService.get<Identity.UserRoleResDto>(Endpoint.GetUserRoleById(id));
  result.roles = role.items;
  return result;
};

const createUser = async (user: Identity.CreateUpdateUserDto) => {
  const apiService = await getApiService();
  const result = await apiService.post(Endpoint.CreateUser(), user);
  return result;
};

const updateUser = async ({id, data}: {id: string, data: Identity.CreateUpdateUserDto}) => {
  const apiService = await getApiService();
  const result = await apiService.put(Endpoint.UpdateUser(id), data);
  return result;
};


const deleteUserById = async (id: string) =>  {
  const apiService = await getApiService();
  await apiService.delete(Endpoint.RemoveUser(id));
};

const getUsersForTaskAssignment = async (classId?: string) =>  {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<Identity.UserForTaskAssignmentDto>>
    (Endpoint.GetUsersForTaskAssignment(classId));
  return result;
};

const getAssignableRoles = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Identity.UserRoleResDto>(Endpoint.GetAssignableRoles());
  return result;
};

const getAllRoles = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<Identity.RoleDto>>(Endpoint.GetAllRoles());
  return result;
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
  const apiService = await getApiService();
  const result = await apiService.put(Endpoint.UpdateRole(id), { ...data, isDefault: false, isPublic: true });
  return result;
};

const getPermissions = async (data: Identity.PermissionProvider) => {
  const apiService = await getApiService();
  const result = await apiService.get<Identity.PermissionResDto>(Endpoint.GetPermissions(), data);
  return result;
};

const updateRolePermissions = async ({provider, data}: 
  { provider: Identity.PermissionProvider; data: Identity.UpdateRolePermissionDto}) => {
  const apiService = await getApiService();
  const queryString = `?providerName=${provider.providerName}&providerKey=${provider.providerKey}`;
  const result = await apiService.put(Endpoint.UpdatePermissions() + queryString, data);
  return result;
};

const deleteRoleById = async (id: string) => {
  const apiService = await getApiService();
  await apiService.delete(Endpoint.RemoveRole(id));
};

const isEmailAlreadyUsed = async (email: string, userId: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.IsEmailAlreadyUsed(email, userId));
  return result;
};

const doesStudentHaveAccountAlready = async (studentId: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<string>(Endpoint.DoesStudentHaveAccountAlready(studentId));
  return result;
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
  deleteRoleById,
  isEmailAlreadyUsed,
  doesStudentHaveAccountAlready
};

export default IdentityService;