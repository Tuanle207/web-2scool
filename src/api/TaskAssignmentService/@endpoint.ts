const Endpoint = {
  CreateUpdate: () =>
    `/api/app/task-assigment/create-update-schedule`,
  GetAll: (query: string) =>
    `/api/app/task-assigment/get-schedules${query}`,
  GetForUpdate: (query: string) =>
    `/api/app/task-assigment/get-schedules-for-update${query}`,
  GetAssignedClassesForDcpReport: (taskType: string) => 
    `api/app/task-assigment/assigned-class-for-dcp-report?taskType=${taskType}`
};

export default Endpoint;