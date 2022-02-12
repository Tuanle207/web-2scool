import { Util } from './Util';

export namespace Profile {
  
  export interface GetMyProfileResponse {
    extraProperties: Util.IObject;
    userName: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
    isExternal: true;
    hasPassword: true;
  }

  export interface UpdateMyProfileRequest {
    userName: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
}