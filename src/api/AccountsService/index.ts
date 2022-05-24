import { Account, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';

const getTaskAssignmentAccounts = async (classId?: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<Account.SimpleAccountDto>>
    (Endpoint.GetTaskAssignmentAccounts(classId));
  return result;
};

const getCurrentAccount = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Account.CurrentAccountDto>
    (Endpoint.GetCurrentAccount());
  return result;
};

export const AccountsService = {
  getTaskAssignmentAccounts,
  getCurrentAccount
};