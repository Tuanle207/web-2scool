import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import ProtectedRoute from '../components/Router/ProtectedRoute';
import CoursesPage from '../views/CoursesPage';
import TeachersPage from '../views/TeachersPage';
import GradesPage from '../views/GradesPage';
import ClassesPage from '../views/ClassesPage';
import StudentsPage from '../views/StudentsPage';
import DCPReportsApprovalPage from '../views/DCPReportsApprovalPage';
import DCPReportPage from '../views/DCPReportPage';
import MyDCPReportPage from '../views/MyDCPReportPage';
import UserManagement from '../views/UserManagement';
import RoleManagement from '../views/RoleManagement';
import DCPReportCreatePage from '../views/DCPReportCreatePage';
import DCPReportHistoryPage from '../views/DCPReportHistoryPage';
import DCPRankingPage from '../views/DCPRankingPage';
import DCPStatisticsPage from '../views/DCPStatisticsPage';
import ErrorPage from '../views/ErrorPage';
import { policies } from '../common/appConsts';
import DCPReportUpdatePage from '../views/DCPReportUpdatePage';
import DCPReportSchedule from '../views/DCPReportSchedule';
import DCPReportScheduleAssignment from '../views/DCPReportScheduleAssignment';
import LessonRegisterReportSchedule from '../views/LessonRegisterReportSchedule';
import LessonRegisterReport from '../views/LessonRegisterReport';
import LessonRegisterReportCreate from '../views/LessonRegisterReportCreate';

const DashboardRouter = () => {
  return (
    <Router>
      <Switch>
        <Route 
          path='/dashboard' 
          exact
          component={Dashboard}
        />
        <ProtectedRoute 
          path='/dcp-report-approval'
          exact
          policyName={policies.DcpReportApproval}
          component={DCPReportsApprovalPage}
        />
        <ProtectedRoute 
          path='/dcp-report-approval/:dcpReportId'
          exact
          policyName={policies.GetDcpReportDetail}
          component={DCPReportPage}
        />
         <ProtectedRoute 
          path='/dcp-report-history'
          exact
          policyName={policies.GetDcpReportApprovalHistory}
          component={DCPReportHistoryPage}
        />
        <ProtectedRoute 
          path='/my-dcp-report'
          exact
          policyName={policies.GetMyDcpReport}
          component={MyDCPReportPage}
        />
         <ProtectedRoute 
          path='/my-lr-report'
          exact
          policyName={policies.GetMyLRReport}
          component={LessonRegisterReport}
        />
        <ProtectedRoute 
          path='/dcp-report-creation'
          exact
          policyName={policies.CreateNewDcpReport}
          component={DCPReportCreatePage}
        />
        <ProtectedRoute 
          path='/lr-report-creation'
          exact
          policyName={policies.CreateNewLRReport}
          component={LessonRegisterReportCreate}
        />
        <ProtectedRoute 
          path='/dcp-report-update/:dcpReportId'
          exact
          policyName={policies.UpdateDcpReport}
          component={DCPReportUpdatePage}
        />
        <ProtectedRoute 
          path='/dcp-report-schedules'
          exact
          policyName={policies.GetScheduleList}
          component={DCPReportSchedule}
        />
        <ProtectedRoute
          path='/dcp-report-schedules-assignment'
          exact
          policyName={policies.AssignDcpReport}
          component={DCPReportScheduleAssignment}
        />
        <ProtectedRoute 
          path='/lesson-register-report-schedules'
          exact
          policyName={policies.AssignLessonRegisterReport}
          component={LessonRegisterReportSchedule}
        />
        <ProtectedRoute 
          path='/dcp-rankings'
          exact
          policyName={policies.Rankings}
          component={DCPRankingPage}
        />
        <ProtectedRoute 
          path='/dcp-statistics'
          exact
          policyName={policies.Statistics}
          component={DCPStatisticsPage}
        />
        <ProtectedRoute 
          path='/my-dcp-report/:dcpReportId'
          exact
          policyName={policies.GetDcpReportDetail}
          component={MyDCPReportPage}
        />
        <ProtectedRoute
          path='/admin/courses' 
          exact
          policyName={policies.Courses}
          component={CoursesPage}
        />
        <ProtectedRoute 
          path='/admin/classes'
          policyName={policies.Courses}
          component={ClassesPage}
        />
        <ProtectedRoute 
          path='/admin/students'
          policyName={policies.Courses}
          component={StudentsPage}
        />
        <ProtectedRoute 
          path='/admin/teachers'
          policyName={policies.Courses}
          component={TeachersPage}
        />
        <ProtectedRoute 
          path='/admin/grades'
          policyName={policies.Courses}
          component={GradesPage}
        />
        <ProtectedRoute 
          path='/admin/users'
          policyName={policies.AbpIdentityUsers}
          component={UserManagement}
        />
        <ProtectedRoute 
          path='/admin/roles'
          policyName={policies.AbpIdentityRoles}
          component={RoleManagement}
        />
        <Route 
          path='/errors'
          component={ErrorPage}
        />
        <Redirect to='/dashboard' />
      </Switch>
    </Router>
  );
};

export default DashboardRouter;