import { Grade, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createGrade = async (input: Grade.CreateUpdateGradeDto) => {
  const apiService = await getApiService();
  const result = await apiService.post(Endpoint.CreateGrade(), input);
  return result;
};

const updateGrade = async ({id, data}: {id: string, data: Grade.CreateUpdateGradeDto}) => {
  const apiService = await getApiService();
  const result = await apiService.put(Endpoint.UpdateGrade(id), data);
  return result;
};

const getGradeById = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Grade.GradeDto>(Endpoint.GetGradeById(id));
  return result;
};

const getAllGrades =  async (pagingInfo: Util.PagingInfo) => {
  const apiService = await getApiService();
  const result = await apiService.post<Util.PagingModel<Grade.GradeDto>>(Endpoint.GetAllGrades(), pagingInfo);
  return result;
};

const getGradesForSimpleList = async () => {
  const apiService = await getApiService();
  const result = await apiService.get<Util.PagingModel<Grade.GradeForSimpleListDto>>(Endpoint.GetGradesForSimpleList());
  return result;
};

const deleteGradeById =  async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.delete(Endpoint.DeleteGradeById(id));
  return result;
};

const isNameAlreadyUsed = async (name: string, id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.IsNameAlreadyUsed(name, id));
  return result;
}

export const GradesService = {
  createGrade,
  getAllGrades,
  getGradesForSimpleList,
  getGradeById,
  deleteGradeById,
  updateGrade,
  isNameAlreadyUsed,
};