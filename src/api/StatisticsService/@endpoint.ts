const Endpoint = {
  GetOverallRanking: (query: string) =>
    `/api/app/statistics/overall-ranking${query}`,
  GetDcpRanking: (query: string) =>
    `/api/app/statistics/dcp-ranking${query}`,
  GetLrRanking: (query: string) =>
    `/api/app/statistics/lr-ranking${query}`,
  GetClassesFaults: (query: string) =>
    `/api/app/statistics/classes-faults${query}`,
  GetCommonFaults: (query: string) =>
    `/api/app/statistics/common-faults${query}`,
  GetStudentsWithMostFaults: (query: string) =>
    `/api/app/statistics/students-with-most-faults${query}`,
  GetStatForLineChart: (query: string) =>
    `/api/app/statistics/stat-for-line-chart${query}`,
  GetOverallRankingExcel: (query: string) =>
    `/api/app/statistics/overall-ranking-excel${query}`,
  GetDcpRankingExcel: (query: string) =>
    `/api/app/statistics/dcp-ranking-excel${query}`,
  GetLrRankingExcel: (query: string) =>
    `/api/app/statistics/lr-ranking-excel${query}`,
  GetClassesFaultsExcel: (query: string) =>
    `/api/app/statistics/classes-faults-excel${query}`,
  GetCommonFaultsExcel: (query: string) =>
    `/api/app/statistics/common-faults-excel${query}`,
  GetStudentsWithMostFaultsExcel: (query: string) =>
    `/api/app/statistics/students-with-most-faults-excel${query}`,
};

export default Endpoint;