import { Teacher, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';

const createTeacher = async (input: Teacher.CreateUpdateTeacherDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.post(Endpoint.CreateTeacher(), input);
  return result;
};

const updateTeacher = async ({id, data}: {id: string, data: Teacher.CreateUpdateTeacherDto}) => {
  const apiService = await getApiService();
  const result = await apiService.put(Endpoint.UpdateTeacher(id), data);
  return result;
};

const getTeacherById = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<Teacher.TeacherDto>(Endpoint.GetTeacherById(id));
  return result;
};

const getAllTeachers =  async (pagingInfo: Util.PagingInfo) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.post<Util.PagingModel<Teacher.TeacherDto>>(Endpoint.GetAllTeachers(), pagingInfo);
  return result;
};

const getAllTeachersSimpleList = async () =>  {
  const apiService = await getApiService({ queryActiveCourse: true });
  const result = await apiService.get<Util.PagingModel<Teacher.TeacherForSimpleListDto>>(Endpoint.getAllTeachersSimpleList());
  return result;
};

const removeTeacher = async ({id}: {id: string}) => {
  const apiService = await getApiService();
  const result = await apiService.delete(Endpoint.RemoveTeacher(id));
  return result;
};

const isAlreadyFormTeacher = async(teacherId: string, classId: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.IsAlreadyFormTeacher(teacherId, classId));
  return result;
}

export const TeachersService = {
  createTeacher,
  getAllTeachers,
  getAllTeachersSimpleList,
  getTeacherById,
  removeTeacher,
  updateTeacher,
  isAlreadyFormTeacher
};