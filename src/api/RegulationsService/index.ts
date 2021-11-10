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

const getAllRegulations = async (pagingInfo: Util.PagingInfo) => {
  const apiService = await getApiService();
  const result = await apiService.post<Util.PagingModel<Regulation.RegulationDto>>(Endpoint.GetAllRegulations(), pagingInfo);
  return result;
};

const RegulationsService ={
  getRegulationForSimpleList,
  getCriteriaForSimpleList,
  getAllRegulations
};

export default RegulationsService