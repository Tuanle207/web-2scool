import { configEnv } from '../../@config';
import { Class, TaskAssignment, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createUpdate = async (input: TaskAssignment.CreateUpdateTaskAssignmentDto) => {
  try {
    const apiService = await getApiService();
    await apiService.post(Endpoint.CreateUpdate(), input);
  } catch (error) {
    throw error;
  }
};

const getAll = async (input: TaskAssignment.TaskAssignmentFilterDto ) => {
  try {
    const apiService = await getApiService();
    let query = `?TaskType=${input.taskType}`;
    if (input.className) {
      query += `&ClassName=${input.className}`;
    }
    if (input.assigneeName) {
      query += `&ClassName=${input.assigneeName}`;
    }
    const result = await apiService.get<Util.PagingModel<TaskAssignment.TaskAssignmentDto>>(Endpoint.GetAll(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getForUpdate = async (input: TaskAssignment.TaskAssignmentFilterDto ) => {
  try {
    const apiService = await getApiService();
    let query = `?TaskType=${input.taskType}`;
    const result = await apiService.get<Util.PagingModel<TaskAssignment.TaskAssignmentForUpdateDto>>(Endpoint.GetForUpdate(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getAssignedClassesForDcpReport = async (taskType: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<Util.PagingModel<Class.ClassForSimpleListDto>>(Endpoint.GetAssignedClassesForDcpReport(taskType));
    return result;
  } catch (error) {
    throw error;
  }
};


const TaskAssignmentService = {
  createUpdate,
  getAll,
  getForUpdate,
  getAssignedClassesForDcpReport
};

export default TaskAssignmentService;