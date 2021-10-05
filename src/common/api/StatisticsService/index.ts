import { configEnv } from '../../@config';
import { Stats, Util } from '../../interfaces';
import { getApiService } from '../BaseApiService';
import Endpoint from './@endpoint';


const getDcpRanking = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    const result = await apiService.get<Util.PagingModel<Stats.DcpClassRanking>>(Endpoint.GetDcpRanking(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getClassesFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    const result = await apiService.get<Util.PagingModel<Stats.DcpClassFault>>(Endpoint.GetClassesFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};
const getCommonFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    const result = await apiService.get<Util.PagingModel<Stats.CommonDcpFault>>(Endpoint.GetCommonFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};
const getStudentsWithMostFaults = async (input: Util.DateFilterDto) => {
  try {
    const apiService = await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    const result = await apiService.get<Util.PagingModel<Stats.StudentWithMostFaults>>(Endpoint.GetStudentsWithMostFaults(query));
    return result;
  } catch (error) {
    throw error;
  }
};

const getDcpRankingExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    window.open(configEnv().host + Endpoint.GetDcpRankingExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getClassesFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    window.open(configEnv().host + Endpoint.GetClassesFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getCommonFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    window.open(configEnv().host + Endpoint.GetCommonFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const getStudentsWithMostFaultsExcel = async (input: Util.DateFilterDto) => {
  try {
    await getApiService();
    const query = `?StartTime=${input.startTime.toLocaleString()}&EndTime=${input.endTime.toLocaleString()}`;
    window.open(configEnv().host + Endpoint.GetStudentsWithMostFaultsExcel(query), '_blank');
  } catch (error) {
    throw error;
  }
};

const StatisticsService = {
  getDcpRanking,
  getClassesFaults,
  getCommonFaults,
  getStudentsWithMostFaults,
  getDcpRankingExcel,
  getClassesFaultsExcel,
  getCommonFaultsExcel,
  getStudentsWithMostFaultsExcel
};

export default StatisticsService;