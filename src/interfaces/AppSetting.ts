
export namespace AppSetting {
  export interface AppSettingDto {
    id: string;
    typeCode: string;
    value: string;
    description: string;
  }

  export interface CreateUpdateAppSettingDto {
    typeCode: string;
    value: string;
  }
}