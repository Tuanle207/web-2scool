import { DcpReport, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createDcpReport = async (input: DcpReport.CreateUpdateDcpReportDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post(Endpoint.CreateDcpReport(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllDcpReports = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.DcpReportDto>(Endpoint.GetAllDcpReports(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const getDcpReportById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<DcpReport.DcpReportDto>(Endpoint.GetDcpReportById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteDcpReportById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.DeleteDcpReport(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const getDcpRerportForUpdate = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<DcpReport.CreateUpdateDcpReportDto>(Endpoint.GetDcpRerportForUpdate(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const updateDcpReport = async (id: string, input: DcpReport.CreateUpdateDcpReportDto) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.put(Endpoint.UpdateDcpReport(id), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const acceptDcpReport = async (ids: string[]) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.AcceptDcpReport(), {reportIds: ids});
  } catch (error) {
    throw error;
  }
};

const rejectDcpReport = async (id: string) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.RejectDcpReport(id));
  } catch (error) {
    throw error;
  }
};

const cancelAssessDcpReport = async (id: string) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.CancelAssessDcpReport(id));
  } catch (error) {
    throw error;
  }
};

const getMyDcpReports = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.DcpReportDto>(Endpoint.GetMyDcpReports(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const getDcpReportsForApproval = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.DcpReportDto>(Endpoint.GetDcpReportsForApproval(), input);
    return result;
  } catch (error) {
    throw error;
  }
};


const DcpReportsService = {
  createDcpReport,
  getAllDcpReports,
  deleteDcpReportById,
  getDcpRerportForUpdate,
  updateDcpReport,
  getDcpReportById,
  acceptDcpReport,
  rejectDcpReport,
  cancelAssessDcpReport,
  getMyDcpReports,
  getDcpReportsForApproval
};



export default DcpReportsService;