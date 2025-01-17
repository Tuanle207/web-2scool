import { Course, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createCourse = async (input: Course.CreateUpdateCourseDto) => {
  try {
    const apiService = await getApiService({ queryActiveCourse: true });
    const result = await apiService.post(Endpoint.CreateCourse(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateCourse = async ({id, data}: {id: string, data: Course.CreateUpdateCourseDto}) => {
  try {
    const apiService = await getApiService({ queryActiveCourse: true });
    const result = await apiService.put(Endpoint.UpdateCourse(id), data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getCourseById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Course.CourseDto>(Endpoint.GetCourseById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllCourses =  async (pagingInfo: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<Util.PagingModel<Course.CourseDto>>(Endpoint.GetAllCourses(), pagingInfo);
    return result;
  } catch (error) {
    throw error;
  }
};

const removeCourse =  async ({courseId}: {courseId: string}) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.RemoveCourse(courseId));
    return result;
  } catch (error) {
    throw error;
  }
};

const isNameAlreadyUsed = async (id: string, name: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.IsNameAlreadyUsed(id, name));
  return result;
};

const markAsActiveCourse = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.MarkAsActiveCourse(id));
  return result;
};

const hasActiveCourse = async (id: string) => {
  const apiService = await getApiService();
  const result = await apiService.get<boolean>(Endpoint.HasActiveCourse());
  return result;
};

export const CoursesService = {
  createCourse,
  getAllCourses,
  getCourseById,
  removeCourse,
  updateCourse,
  isNameAlreadyUsed,
  markAsActiveCourse,
  hasActiveCourse,
};