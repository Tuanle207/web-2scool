const Endpoint = {
  
  GetUserProfile: () =>
    `/api/identity/my-profile`,
  UpdateProfileDetail: () =>
    `/api/identity/my-profile`,
  ChangePassword: () =>
    `/api/identity/my-profile/change-password`,

  // role management
  GetAllRoles: () =>
    `/api/identity/roles/all`,
  GetRoleById: (id: string) =>
    `/api/identity/roles/${id}`,
  GetAllRolesWithFilter: () =>
    `/api/identity/roles`,
  CreateRole: () =>
    `/api/identity/roles`,
  UpdateRole: (id: string) =>
    `/api/identity/roles/${id}`,
  RemoveRole: (id: string) =>
    `/api/identity/roles/${id}`,
  GetUserRoles: (id: string) =>
    `/api/identity/users/${id}/roles`,
  GetPermissions: () =>
    `/api/permission-management/permissions`,
  UpdatePermissions: (providerName: string, providerKey: string) =>
    `/api/permission-management/permissions?providerName=${providerName}&providerKey=${providerKey}`,
  
  // user managerment
  GetUsers: () =>
    `/api/app/app-identity-user/paging`,
  GetUserById: (id: string) =>
    `/api/identity/users/${id}`,
  GetUserRoleById: (id: string) =>
    `/api/identity/users/${id}/roles`,
  UpdateUserRoleById: (id: string) =>
    `/api/identity/users/${id}/roles`,
  GetAssignableRoles: () =>
    `/api/identity/users/assignable-roles`,
  CreateUser: () =>
    `/api/app/app-identity-user`,
  UpdateUser: (id: string) =>
    `/api/app/app-identity-user/${id}`,
  RemoveUser: (id: string) =>
    `/api/identity/users/${id}`,
  GetUsersForTaskAssignment: (classId?: string) => 
    `/api/app/app-identity-user/user-for-task-assignment${classId ? `?classId=${classId}` : ''}`,
  IsEmailAlreadyUsed: (email: string, userId: string) =>
    `/api/app/app-identity-user/is-email-already-used?email=${email}&userId=${userId}`,
  DoesStudentHaveAccountAlready: (studentId: string) =>
    `/api/app/app-identity-user/does-student-have-account-already?studentId=${studentId}`,
  IsRoleNameAlreadyUsed: (roleId: string, name: string) => 
    `api/app/app-identity-user/is-role-name-already-used?roleId=${roleId}&name=${name}`  
}

export default Endpoint;