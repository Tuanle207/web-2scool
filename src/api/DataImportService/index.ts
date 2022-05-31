import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const importStudentsData = async (excel: File) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportStudentsData(), formData);
  return result;
};

const importTeachersData = async (excel: File) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportTeachersData(), formData);
  return result;
};

const importClassesData = async (excel: File) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportClassesData(), formData);
  return result;
};

const importRegulationsData = async (excel: File) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportRegulationsData(), formData);
  return result;
};

const importCriteriasData = async (excel: File) => {
  const apiService = await getApiService();
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportCriteriasData(), formData);
  return result;
};

export const DataImportService = {
  importStudentsData,
  importTeachersData,
  importClassesData,
  importRegulationsData,
  importCriteriasData,
};