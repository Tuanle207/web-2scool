/**
   * Ultilities Interface
   */
export namespace Util {
  
  export interface IObject<T = any> { [key: string]: T;}

  export interface BaseAction {
    type: string,
    payload?: any
  }

  export interface DataError {
    id: string,
    msg: string; 
  }

  export interface PagingFilter {
    key: string;
    comparison: string;
    value: string;
  }

  export interface PagingInfo {
    pageIndex?: number;
    pageSize?: number;
    sortName?: string;
    ascend?: boolean;
    filter?: Array<PagingFilter>;
  }

  export interface PagingModel<T> {
    items: Array<T>;
    totalCount: number;
    pageIndex: number;
    pageSize: number; 
  }

  export interface IHaveExtraProperties {
    extraProperties: IObject;
  }

  export interface DateFilterDto {
    startTime: Date;
    endTime: Date;
  }

  export interface AppConfig {
    auth: {
      grantedPolicies: IObject<boolean>;
      policies: IObject<boolean>;
    },
    clock: {
      kind: string;
    },
    currentTenant: {
      id?: string;
      isAvailable: boolean;
      name?: string;
    },
    currentUser: {
      id: string;
      userName: string;
      surName: string;
      email: string;
      emailVerified: boolean;
      name: string;
      phoneNumber: string;
      phoneNumberVerified: boolean;
      roles: string[];
      tenantId: string;
      isAuthenticated: boolean;
    },
    currentAccount: {
      isAuthenticated: boolean;
      hasAccount: boolean;
      isStudent: boolean;
      isTeacher: boolean;
      id: string;
      userId: string;
      displayName: string;
      email: string;
      phoneNumber: string;
      dob?: Date;
      avatar: string;
      classId: string;
      studentId: string;
      teacherId: string;
      creationTime?: Date;
      creatorId: string;
    },
    features: {
      value: IObject
    },
    localization: {
      currentCulture: IObject;
      defaultResourceName: string;
      languageFilesMap: IObject;
      languages: IObject;
      languagesMap: IObject;
      values: IObject;
    },
    multiTenancy: {
      isEnabled: boolean;
    },
    objectExtensions: {
      enums: IObject;
      modules: IObject;
    },
    setting: {
      value: IObject;
    },
    timing: {
      timeZone: IObject;
    }
  }

  export interface TenantSetting {
    name?: string;
    displayName?: string;
  }
}