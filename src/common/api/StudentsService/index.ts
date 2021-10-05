import { Student, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createStudent = async (input: Student.CreateUpdateStudentDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateStudent(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateStudent = async ({id, data}: {id: string, data: Student.CreateUpdateStudentDto}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateStudent(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getStudentById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Student.StudentDto>(Endpoint.GetStudentById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllStudents = async (pagingInfo: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<Util.PagingModel<Student.StudentDto>>(Endpoint.GetAllStudents(), pagingInfo);
    return result;
  } catch (error) {
    throw error;
  }
};

const getStudentForSimpleList = async (classId?: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Student.StudentForSimpleListDto>>(Endpoint.GetStudentForSimpleList() + (classId ? `?classId=${classId}` : ''));
    return result;
  } catch (error) {
    throw error;
  }
};

const removeStudent =  async ({id}: {id: string}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.RemoveStudent(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const StudentsService = {
  createStudent,
  getAllStudents,
  getStudentForSimpleList,
  getStudentById,
  removeStudent,
  updateStudent
};

export default StudentsService;