import { Grade, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createGrade = async (input: Grade.CreateUpdateGradeDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateGrade(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateGrade = async ({id, data}: {id: string, data: Grade.CreateUpdateGradeDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateGrade(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getGradeById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Grade.GradeDto>(Endpoint.GetGradeById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllGrades =  async (pagingInfo: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<Util.PagingModel<Grade.GradeDto>>(Endpoint.GetAllGrades(), pagingInfo);
    return result;
  } catch (error) {
    throw error;
  }
};

const removeGrade =  async ({id}: {id: string}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.RemoveGrade(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const GradesService = {
  createGrade,
  getAllGrades,
  getGradeById,
  removeGrade,
  updateGrade
};

export default GradesService;