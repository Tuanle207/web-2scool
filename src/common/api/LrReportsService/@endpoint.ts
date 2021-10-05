const Endpoint = {
  CreateLrReport: () => `/api/app/lr-report`,
  GetLrReportById: (id: string) => `/api/app/lr-report/${id}`,
  GetLrRerportForUpdate: (id: string) => `/api/app/lr-report/${id}/update`,
  UpdateLrReport: (id: string) => `/api/app/lr-report/${id}`,
  GetAllLrReports: () => `/api/app/lr-report/paging`,
  GetLrReportsForApproval: () => `/api/app/lr-report/get-reports-for-approval`,
  GetMyLrReports: () => `/api/app/lr-report/get-my-reports`,
  GetLrRerportDetail: (id: string) => `/api/app/lr-report/${id}`,
  AcceptLrReport: () => `/api/app/lr-report/accept`,
  RejectLrReport: (id: string) => `/api/app/lr-report/${id}/reject`,
  CancelAssessLrReport: (id: string) => `/api/app/lr-report/${id}/cancel-assess`,
  DeleteLrReport: (id: string) => `/api/app/lr-report/${id}`,
}

export default Endpoint;