import { Stats, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';
import { formatDate } from '../../utils/TimeHelper';
import { saveBlobAsFile } from '../../utils/FileHelper';
import moment from 'moment';

const formatQueryDate = (date: Date) => {
  return formatDate(date.toLocaleString(), "MM/DD/YYYY");
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
  saveBlobAsFile(blob, `thong-ke-loi-vi-pham-${getCurrentTimeString()}`);
};

const getStudentsWithMostFaultsExcel = async (input: Util.DateFilterDto) => {
  const apiService = await getApiService({ queryActiveCourse: true, blobResponseType: true });
  const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;

  const blob = await apiService.get<Blob>(Endpoint.GetStudentsWithMostFaultsExcel(query));
  saveBlobAsFile(blob, `thong-ke-hoc-sinh-vi-pham-${getCurrentTimeString()}`);
};

export const StatisticsService = {
  getOverallRanking,
  getDcpRanking,
  getLrRanking,
  getClassesFaults,
  getCommonFaults,
  getStudentsWithMostFaults,
  getStatForLineChart,
  getOverallRankingExcel,
  getDcpRankingExcel,
  getLrRankingExcel,
  getClassesFaultsExcel,
  getCommonFaultsExcel,
  getStudentsWithMostFaultsExcel,
};