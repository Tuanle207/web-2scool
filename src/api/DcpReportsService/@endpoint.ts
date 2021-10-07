const Endpoint = {
  CreateDcpReport: () => `/api/app/dcp-reports`,
  GetDcpReportById: (id: string) => `/api/app/dcp-reports/${id}`,
  GetDcpRerportForUpdate: (id: string) => `/api/app/dcp-reports/${id}/update`,
  UpdateDcpReport: (id: string) => `/api/app/dcp-reports/${id}`,
  GetAllDcpReports: () => `/api/app/dcp-reports/paging`,
  GetDcpReportsForApproval: () => `/api/app/dcp-reports/get-reports-for-approval`,
  GetMyDcpReports: () => `/api/app/dcp-reports/get-my-reports`,
  GetDcpRerportDetail: (id: string) => `/api/app/dcp-reports/${id}`,
  AcceptDcpReport: () => `/api/app/dcp-reports/accept`,
  RejectDcpReport: (id: string) => `/api/app/dcp-reports/${id}/reject`,
  CancelAssessDcpReport: (id: string) => `/api/app/dcp-reports/${id}/cancel-assess`,
  DeleteDcpReport: (id: string) => `/api/app/dcp-reports/${id}`,
}

export default Endpoint;