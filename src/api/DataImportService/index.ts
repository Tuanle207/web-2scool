import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const importStudentsData = async (excel: File) => {
  const apiService = await getApiService();
  const formData = new FormData();
  formData.append('file', excel);
  const result = await apiService.postFormData(Endpoint.ImportStudentsData(), formData);
  return result;
};

const DataImportService = {
  importStudentsData
};



export default DataImportService;