import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Regulation, Util } from '../../interfaces';

const getRegulationForSimpleList = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Regulation.RegulationForSimpleListDto>>(Endpoint.GetRegulationSimpleList());
    return result;
  } catch (error) {
    throw error;
  }
};

const getCriteriaForSimpleList = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Regulation.CriteriaForSimpleList>>(Endpoint.GetCriteriaSimpleList());
    return result;
  } catch (error) {
    throw error;
  }
};

const RegulationsService ={
  getRegulationForSimpleList,
  getCriteriaForSimpleList
};

export default RegulationsService