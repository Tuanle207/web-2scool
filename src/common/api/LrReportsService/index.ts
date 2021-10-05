import { DcpReport, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const createLrReport = async (input: DcpReport.CreateUpdateLRReportDto) => {
  try {
    const apiService = await getApiService();
    
    var body = new FormData();
    body.append('ClassId', input.classId);
    body.append('Photo', input.photo);
    body.append('AbsenceNo', input.absenceNo.toString());
    body.append('TotalPoint', input.totalPoint.toString());
    
    const result = await apiService.post(Endpoint.CreateLrReport(), body);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllLrReports = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.LRReportDto>(Endpoint.GetAllLrReports(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const getLrReportById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.get<DcpReport.LRReportDto>(Endpoint.GetLrReportById(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteLrReportById = async (id: string) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.delete(Endpoint.DeleteLrReport(id));
    return result;
  } catch (error) {
    throw error;
  }
};

const updateLrReport = async (id: string, input: DcpReport.CreateUpdateLRReportDto) => {
  try {
    const apiService = await getApiService();

    var body = new FormData();
    body.append('ClassId', input.classId);
    body.append('Photo', input.photo);
    body.append('AbsenceNo', input.absenceNo.toString());
    body.append('TotalPoint', input.totalPoint.toString());

    const result = await apiService.put(Endpoint.UpdateLrReport(id), body);
    return result;
  } catch (error) {
    throw error;
  }
};

const acceptLrReport = async (ids: string[]) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.AcceptLrReport(), {reportIds: ids});
  } catch (error) {
    throw error;
  }
};

const rejectLrReport = async (id: string) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.RejectLrReport(id));
  } catch (error) {
    throw error;
  }
};

const cancelAssessLrReport = async (id: string) => {
  try {
    const apiService = await getApiService();
    await apiService.post<void>(Endpoint.CancelAssessLrReport(id));
  } catch (error) {
    throw error;
  }
};

const getMyLrReports = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.LRReportDto>(Endpoint.GetMyLrReports(), input);
    return result;
  } catch (error) {
    throw error;
  }
};

const getLrReportsForApproval = async (input: Util.PagingInfo) => {
  try {
    const apiService = await getApiService();
    const result = await apiService.post<DcpReport.LRReportDto>(Endpoint.GetLrReportsForApproval(), input);
    return result;
  } catch (error) {
    throw error;
  }
};


const LrReportsService = {
  createLrReport,
  getAllLrReports,
  deleteLrReportById,
  updateLrReport,
  getLrReportById,
  acceptLrReport,
  rejectLrReport,
  cancelAssessLrReport,
  getMyLrReports,
  getLrReportsForApproval
};



export default LrReportsService;