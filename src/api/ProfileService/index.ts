import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Profile } from '../../interfaces';

const getMyProfile = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Profile.GetMyProfileResponse>(Endpoint.GetMyProfile());
  return result;
};

const updateMyProfile = async (input: Profile.UpdateMyProfileRequest) => {
  const apiService = await getApiService();
  const result = await apiService.post<Profile.GetMyProfileResponse>(Endpoint.UpdateMyProfile(), input);
  return result;
};

const changePassword = async (input: Profile.ChangePasswordRequest) => {
  const apiService = await getApiService();
  const result = await apiService.post<void>(Endpoint.ChangePassword(), input);
  return result;
};

export const ProfileService ={
  getMyProfile,
  updateMyProfile,
  changePassword
};