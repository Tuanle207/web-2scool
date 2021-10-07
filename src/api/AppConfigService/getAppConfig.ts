import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';

const getAppConfig = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get(Endpoint.GetAppConfig());
    return result;
  } catch (err) {
    throw err;
  }
};

export default getAppConfig;