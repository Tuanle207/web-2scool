import { Stats, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';
import { toUtcTimeString } from '../../utils/TimeHelper';
import { saveBlobAsFile } from '../../utils/FileHelper';
import moment from 'moment';

const formatQueryDate = (date: Date): string => {
  return toUtcTimeString(date);
};

const getCurrentTimeString = () => {
  return moment().format("DD-MM-YYYY-hh-mm-ss")
};

const getOverallRanking = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.OverallClassRanking>>(Endpoint.GetOverallRanking(query));
  return result;
};

const getDcpRanking = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.LrClassRanking>>(Endpoint.GetDcpRanking(query));
  return result;
};

const getLrRanking = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.LrClassRanking>>(Endpoint.GetLrRanking(query));
  return result;
};

const getClassesFaults = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.DcpClassFault>>(Endpoint.GetClassesFaults(query));
  return result;
};

const getCommonFaults = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.CommonDcpFault>>(Endpoint.GetCommonFaults(query));
  return result;
  
};

const getStudentsWithMostFaults = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.StudentWithMostFaults>>(Endpoint.GetStudentsWithMostFaults(query));
  return result;
};

const getStatForLineChart = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Stats.LineChartStatDto>(Endpoint.GetStatForLineChart(query));
  return result;
};

const getStatForPieChart = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Stats.PieChartStatDto>(Endpoint.GetStatForPieChart(query));
  return result;
};

const getStatForBarChart = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Stats.BarChartStatDto>(Endpoint.GetStatForBarChart(query));
  return result;
};

const getOverallRankingExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  
  const blob = await apiService.get<Blob>(Endpoint.GetOverallRankingExcel(query));
  saveBlobAsFile(blob, `bap-cao-xep-hang-thi-dua-${getCurrentTimeString()}`);
};

const getDcpRankingExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetDcpRankingExcel(query));
  saveBlobAsFile(blob, `bap-cao-xep-hang-ne-nep-${getCurrentTimeString()}`);
};

const getLrRankingExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetLrRankingExcel(query));
  saveBlobAsFile(blob, `bap-cao-xep-hang-so-dau-bai-${getCurrentTimeString()}`);
};

const getClassesFaultsExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetClassesFaultsExcel(query));
  saveBlobAsFile(blob, `thong-ke-lop-vi-pham-${getCurrentTimeString()}`);
};

const getCommonFaultsExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetCommonFaultsExcel(query));
  saveBlobAsFile(blob, `thong-ke-quy-dinh-ne-nep-${getCurrentTimeString()}`);
};

const getStudentsWithMostFaultsExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetStudentsWithMostFaultsExcel(query));
  saveBlobAsFile(blob, `thong-ke-ne-nep-hoc-sinh-${getCurrentTimeString()}`);
};

const getClassFaultDetails = async (classId: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.ClassFaultDetail>>(Endpoint.GetClassFaultDetails(classId, query));
  return result;
};

const getRegulationFaultDetails = async (regulationId: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.ClassFaultDetail>>(Endpoint.GetRegulationFaultDetails(regulationId, query));
  return result;
};

const getStudentFaultDetails = async (studentId: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.get<Util.PagingModel<Stats.ClassFaultDetail>>(Endpoint.GetStudentFaultDetails(studentId, query));
  return result;
};

const getClassFaultDetailsExcel = async (classId: string, className: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetClassFaultDetailsExcel(classId, query));
  saveBlobAsFile(blob, `bao-cao-chi-tiet-ne-nep-lop-${className}-${getCurrentTimeString()}`);
};

const getRegulationFaultDetailsExcel = async (regulationId: string, regulationName: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetRegulationFaultDetailsExcel(regulationId, query));
  saveBlobAsFile(blob, `thong-ke-chi-tiet-quy-dinh-ne-nep-${regulationName}-${getCurrentTimeString()}`);
};

const getStudentFaultDetailsExcel = async (studentId: string, studentName: string, input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  
  const blob = await apiService.get<Blob>(Endpoint.GetStudentFaultDetailsExcel(studentId, query));
  saveBlobAsFile(blob, `bao-cao-chi-tiet-ne-nep-hoc-sinh-${studentName}-${getCurrentTimeString()}`);
};

const sendClassFaultsThroughEmail = async (input: Util.DateFilterDto, classId?: string) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.post<void>(Endpoint.SendClassFaultsThroughEmail(classId || '', query));
  return result;
};

const sendStudentFaultsThroughEmail = async (input: Util.DateFilterDto, studentId: string) => {
  const apiService = await getApiService({ queryActiveCourse: true });
  
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
  const result = await apiService.post<void>(Endpoint.SendStudentFaultsThroughEmail(studentId, query));
  return result;
};

export const StatisticsService = {
  getOverallRanking,
  getDcpRanking,
  getLrRanking,
  getClassesFaults,
  getCommonFaults,
  getStudentsWithMostFaults,
  getStatForLineChart,
  getStatForPieChart,
  getStatForBarChart,
  getOverallRankingExcel,
  getDcpRankingExcel,
  getLrRankingExcel,
  getClassesFaultsExcel,
  getCommonFaultsExcel,
  getStudentsWithMostFaultsExcel,
  getClassFaultDetails,
  getRegulationFaultDetails,
  getStudentFaultDetails,
  getClassFaultDetailsExcel,
  getRegulationFaultDetailsExcel,
  getStudentFaultDetailsExcel,
  sendClassFaultsThroughEmail,
  sendStudentFaultsThroughEmail,
};