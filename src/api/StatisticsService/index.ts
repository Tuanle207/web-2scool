import { Stats, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import ENV from '../../config/env';
import Endpoint from './@endpoint';
import { formatDate } from '../../utils/TimeHelper';

const formatQueryDate = (date: Date) => {
  return formatDate(date.toLocaleString(), "MM/DD/YYYY");
};

const getOverallRanking = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Util.PagingModel<Stats.OverallClassRanking>>(Endpoint.GetOverallRanking(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getDcpRanking = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Util.PagingModel<Stats.DcpClassRanking>>(Endpoint.GetDcpRanking(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getClassesFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Util.PagingModel<Stats.DcpClassFault>>(Endpoint.GetClassesFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};
const getCommonFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Util.PagingModel<Stats.CommonDcpFault>>(Endpoint.GetCommonFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};
const getStudentsWithMostFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Util.PagingModel<Stats.StudentWithMostFaults>>(Endpoint.GetStudentsWithMostFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getStatForLineChart = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    const result = await apiService.get<Stats.LineChartStatDto>(Endpoint.GetStatForLineChart(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getOverallRankingExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    window.open(ENV.host + Endpoint.GetOverallRankingExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getDcpRankingExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    window.open(ENV.host + Endpoint.GetDcpRankingExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getClassesFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    window.open(ENV.host + Endpoint.GetClassesFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getCommonFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    window.open(ENV.host + Endpoint.GetCommonFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getStudentsWithMostFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${formatQueryDate(input.startTime)}&EndTime=${formatQueryDate(input.endTime)}`;
    window.open(ENV.host + Endpoint.GetStudentsWithMostFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

export const StatisticsService = {
  getOverallRanking,
  getDcpRanking,
  getClassesFaults,
  getCommonFaults,
  getStudentsWithMostFaults,
  getStatForLineChart,
  getOverallRankingExcel,
  getDcpRankingExcel,
  getClassesFaultsExcel,
  getCommonFaultsExcel,
  getStudentsWithMostFaultsExcel
};