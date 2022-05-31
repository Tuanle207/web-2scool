import Endpoint from './@endpoint';
import { getApiService } from '../BaseApiService';
import { Regulation, Util } from '../../interfaces';

const getRegulationForSimpleList = async () => {
  try {
    const apiService = await getApiService({ queryActiveCourse: true });
    const result = await apiService.get<Util.PagingModel<Regulation.RegulationForSimpleListDto>>(Endpoint.GetRegulationSimpleList());
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllRegulations = async (pagingInfo: Util.PagingInfo) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.post<Util.PagingModel<Regulation.RegulationDto>>(Endpoint.GetAllRegulations(), pagingInfo);
  return result;
};

const getRegulationById = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Regulation.RegulationDto>(Endpoint.GetRegulation(id));
  return result;
};

const createRegulation = async (input: Regulation.CreateUpdateRegulationDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.post<Regulation.RegulationDto>(Endpoint.CreateRegulation(), input);
  return result;
};

const updateRegulation = async (id: string, input: Regulation.CreateUpdateRegulationDto) => {
  const apiService = await getApiService();
  const result = await apiService.put<Regulation.RegulationDto>(Endpoint.UpdateRegulation(id), input);
  return result;
};

const removeRegulation = async (id: string) => {
  const apiService = await getApiService();
  await apiService.delete(Endpoint.DeleteRegulation(id));
};

const getCriteriaForSimpleList = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<Regulation.CriteriaForSimpleList>>(Endpoint.GetCriteriaSimpleList());
  return result;
};

const getCriteriaById = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Regulation.CriteriaDto>(Endpoint.GetCriteria(id));
  return result;
};

const getAllCriterias = async (pagingInfo: Util.PagingInfo) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.post<Util.PagingModel<Regulation.CriteriaDto>>(Endpoint.GetAllCriterias(), pagingInfo);
  return result;
};

const createCriteria = async (dto: Regulation.CreateUpdateCriteriaDto) => {
  const apiService = await getApiService();
  const result = await apiService.post<Util.PagingModel<Regulation.CriteriaDto>>(Endpoint.CreateCriteria(), dto);
  return result;
};

const updateCriteria = async (id: string, dto: Regulation.CreateUpdateCriteriaDto) => {
  const apiService = await getApiService();
  const result = await apiService.put<Regulation.CriteriaDto>(Endpoint.UpdateCriteria(id), dto);
  return result;
};

const removeCriteria = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<void>(Endpoint.DeleteCriteria(id));
  return result;
};

export const RegulationsService = {
  getRegulationForSimpleList,
  getAllRegulations,
  createRegulation,
  updateRegulation,
  removeRegulation,
  getRegulationById,

  getCriteriaById,
  getCriteriaForSimpleList,
  getAllCriterias,
  createCriteria,
  updateCriteria,
  removeCriteria,
};