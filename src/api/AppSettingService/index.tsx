import { Util } from '../../interfaces';
import { AppSetting } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';

const getReportAppSetting = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<AppSetting.AppSettingDto>>(Endpoint.GetReportAppSetting());
  return result;
};

const updateReportAppSetting = async (setting: AppSetting.CreateUpdateAppSettingDto[]) => {
  const apiService = await getApiService();
  const result = await apiService.put<void>(Endpoint.GetReportAppSetting(), setting);
  return result;
};

export const AppSettingService = {
  getReportAppSetting,
  updateReportAppSetting,
};