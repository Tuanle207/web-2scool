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
    `/api/app/identity/paging`,
  GetUserById: (id: string) =>
    `/api/identity/users/${id}`,
  GetUserRoleById: (id: string) =>
    `/api/identity/users/${id}/roles`,
  UpdateUserRoleById: (id: string) =>
    `/api/identity/users/${id}/roles`,
  GetAssignableRoles: () =>
    `/api/app/identity/assignable-roles`,
  CreateUser: () =>
    `/api/app/identity`,
  UpdateUser: (id: string) =>
    `/api/app/identity/${id}`,
  RemoveUser: (id: string) =>
    `/api/identity/users/${id}`,
  GetUsersForTaskAssignment: (classId?: string) => 
    `/api/app/identity/user-for-task-assignment${classId ? `?classId=${classId}` : ''}`,
  IsEmailAlreadyUsed: (email: string, userId: string) =>
    `/api/app/identity/is-email-already-used?email=${email}&userId=${userId}`,
  DoesStudentHaveAccountAlready: (studentId: string) =>
    `/api/app/identity/does-student-have-account-already?studentId=${studentId}`,
  DoesTeacherHaveAccountAlready: (teacherId: string) =>
    `/api/app/identity/does-teacher-have-account-already?teacherId=${teacherId}`,
  IsRoleNameAlreadyUsed: (roleId: string, name: string) => 
    `api/app/identity/is-role-name-already-used?roleId=${roleId}&name=${name}`  
}

export default Endpoint;