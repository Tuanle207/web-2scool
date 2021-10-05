import { Util } from './Util';
import { Class } from './Class';

export namespace Identity {
  
  export interface UserDto {
    id: string;
    userName: string;
    name: string;
    roles: UserRoleDto[];
    email: string;
    phoneNumber: string;
  }

  export interface CreateUpdateUserDto extends Util.IHaveExtraProperties {
    userName: string;
    name: string;
    email: string;
    phoneNumber: string;
    roleNames: string[];
    password: string;
  }

  export interface UserRoleDto {
    name: string;
    id: string;
  }

  export interface UserRoleResDto {
    items: UserRoleDto[]
  }

  export interface RoleDto {
    id: string;
    name: string;
  }


  export interface CreateUpdateRoleDto {
    name: string;
  }

  export interface PermissionProvider  {
    providerName: string;
    providerKey?: string;
  }

  export interface Permission {
    grantedProviders: PermissionProvider[];
    isGranted: boolean;
    name: string;
    displayName: string;
    parentName: string;
  }

  export interface PermissionGroup {
    name: string;
    displayName: string;
    permissions: Permission[]
  }
  
  export interface PermissionResDto {
    entityDisplayName: string;
    groups: PermissionGroup[]
  }

  export interface UpdateRolePermissionDto {
    permissions: {
      name: string;
      isGranted: boolean;
    }[]
  }

  export interface UserForTaskAssignmentDto {
    id: string;
    name: string;
    userProfileId: string;
    class: Class.ClassForSimpleListDto;
    phoneNumber: string;
  }
}