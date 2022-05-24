const Endpoint = {
  GetTaskAssignmentAccounts: (classId?: string) =>
    `api/app/accounts/task-assignment-accounts?classId=${classId ?? ''}`,
  GetCurrentAccount: () => 
    `api/app/accounts/current-account`,
};

export default Endpoint;