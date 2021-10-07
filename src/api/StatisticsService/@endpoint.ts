const Endpoint = {
  GetDcpRanking: (query: string) =>
    `/api/app/statistics/dcp-ranking${query}`,
  GetClassesFaults: (query: string) =>
    `/api/app/statistics/classes-faults${query}`,
  GetCommonFaults: (query: string) =>
    `/api/app/statistics/common-faults${query}`,
  GetStudentsWithMostFaults: (query: string) =>
    `/api/app/statistics/students-with-most-faults${query}`,
  GetDcpRankingExcel: (query: string) =>
    `/downloads/dcp-ranking-excel${query}`,
  GetClassesFaultsExcel: (query: string) =>
    `/downloads/classes-faults-excel${query}`,
  GetCommonFaultsExcel: (query: string) =>
    `/downloads/common-faults-excel${query}`,
  GetStudentsWithMostFaultsExcel: (query: string) =>
    `/downloads/students-with-most-faults-excel${query}`,
};

export default Endpoint;