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

const createRegulation = async (input: Regulation.CreateUpdateRegulationDto) => {
  const apiService = await getApiService();
  const result = await apiService.post<Regulation.RegulationDto>(Endpoint.CreateRegulation(), input);
  return result;
};

const updateRegulation = async (input: Regulation.CreateUpdateRegulationDto) => {
  const apiService = await getApiService();
  const result = await apiService.post<Regulation.RegulationDto>(Endpoint.CreateRegulation(), input);
  return result;
};

const deleteRegulation = async (id: string) => {
  const apiService = await getApiService();
  await apiService.delete(Endpoint.DeleteRegulation(id));
};

const RegulationsService ={
  getRegulationForSimpleList,
  getCriteriaForSimpleList,
  getAllRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
};

export default RegulationsService