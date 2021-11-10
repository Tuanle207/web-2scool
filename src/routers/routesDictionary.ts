
export const routes = {
  Dashboard: '/trang-chu',
  DCPReportApproval: '/duyet-cham-diem-ne-nep',
  DCPReportApprovalDetail: '/duyet-cham-diem-ne-nep/:dcpReportId',
  DCPReportHistory: '/lich-su-duyet-cham-diem-ne-nep',
  MyDCPReport: '/phieu-cham-diem-ne-nep-cua-toi',
  MyDCPReportDetail: '/phieu-cham-diem-ne-nep-cua-toi/:dcpReportId',
  MyLRReport: '/phieu-nop-so-dau-bai-cua-toi',
  MyLRReportDetail: '/phieu-nop-so-dau-bai-cua-toi/:dcpReportId',
  CreateDCPReport: '/tao-phieu-cham-diem-ne-nep',
  UpdateDCPReport: '/cap-nhat-cham-diem-ne-nep',
  CreateLRReport: '/tao-phieu-so-dau-bai',
  DCPReportSchedule: '/phan-cong-lich-cham-diem-ne-nep',
  DCPReportScheduleAssignment: '/cap-nhat-lich-cham-diem-ne-nep',
  LRReportSchedule: '/phan-cong-giu-so-dau-bai',
  LRReportScheduleAssignment: '/cap-nhat-phan-cong-giu-so-dau-bai',
  DCPRanking: '/xep-hang-ne-nep',
  DCPStatistics: '/thong-ke-ne-nep',
  CoursesManager: '/quan-ly-khoa-hoc',
  ClassesManager: '/quan-ly-lop-hoc',
  StudentsManager: '/quan-ly-hoc-sinh',
  TeachersManager: '/quan-ly-giao-vien',
  GradesManager: '/quan-ly-khoi',
  UsersManager: '/quan-ly-nguoi-dung',
  RolesManager: '/quan-ly-vai-tro-nguoi-dung',
  Profile: '/tai-khoan-cua-toi',
  RegulationManager: '/quan-ly-quy-dinh',

  //
  Login: '/dang-nhap'
};

export const routeWithParams = (route: string, ...params: string[]) => {
  const segments = route.split('/');
  let paramsPassed = 0;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].startsWith(':')) {
      segments[i] = params[paramsPassed];
      paramsPassed++;
    }
  }
  return segments.join('/');
};