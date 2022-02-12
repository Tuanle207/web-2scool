import { Teacher, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createTeacher = async (input: Teacher.CreateUpdateTeacherDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateTeacher(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateTeacher = async ({id, data}: {id: string, data: Teacher.CreateUpdateTeacherDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateTeacher(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getTeacherById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Teacher.TeacherDto>(Endpoint.GetTeacherById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllTeachers =  async (pagingInfo: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<Util.PagingModel<Teacher.TeacherDto>>(Endpoint.GetAllTeachers(), pagingInfo);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllTeachersSimpleList = async () =>  {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Teacher.TeacherForSimpleListDto[]>(Endpoint.getAllTeachersSimpleList());
    return result;
  } catch (error) {
    throw error;
  }
};

const removeTeacher =  async ({id}: {id: string}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.RemoveTeacher(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const TeachersService = {
  createTeacher,
  getAllTeachers,
  getAllTeachersSimpleList,
  getTeacherById,
  removeTeacher,
  updateTeacher
};

export default TeachersService;