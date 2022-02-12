import { Class, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createClass = async (input: Class.CreateUpdateClassDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateClass(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateClass = async ({id, data}: {id: string, data: Class.CreateUpdateClassDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateClass(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getClassById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Class.ClassDto>(Endpoint.GetClassById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllClasss = async (pagingInfo: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<Util.PagingModel<Class.ClassDto>>(Endpoint.GetAllClasss(), pagingInfo);
    return result;
  } catch (error) {
    throw error;
  }
};

const getClassForSimpleList = async () => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Class.ClassForSimpleListDto>>(Endpoint.GetClassForSimpleList());
    return result;
  } catch (error) {
    throw error;
  }
};

const removeClass =  async ({id}: {id: string}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.RemoveClass(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const ClassesService ={
  createClass,
  getAllClasss,
  getClassForSimpleList,
  getClassById,
  removeClass,
  updateClass
};

export default ClassesService;