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
import DCPReportUpdatePage from '../views/DCPReportUpdatePage';
import DCPReportSchedule from '../views/DCPReportSchedule';
import DCPReportScheduleAssignment from '../views/DCPReportScheduleAssignment';
import LessonRegisterReportSchedule from '../views/LessonRegisterReportSchedule';
import LessonRegisterReport from '../views/LessonRegisterReport';
import LessonRegisterReportCreate from '../views/LessonRegisterReportCreate';
import ProfilePage from '../views/ProfilePage';
import { policies } from '../appConsts';
import { routes } from './routesDictionary';
import RegulationsPage from '../views/RegulationsPage';
import LessonRegisterReportScheduleAssignment from '../views/LessonRegisterReportScheduleAssignment';

const DashboardRouter = () => {
  return (
    <Router>
      <Switch>
        <Route 
          path={routes.Dashboard} 
          exact
          component={Dashboard}
        />
        <ProtectedRoute 
          path={routes.DCPReportApproval}
          exact
          policyName={policies.DcpReportApproval}
          component={DCPReportsApprovalPage}
        />
        <ProtectedRoute 
          path={routes.DCPReportApprovalDetail}
          exact
          policyName={policies.GetDcpReportDetail}
          component={DCPReportPage}
        />
         <ProtectedRoute 
          path={routes.DCPReportHistory}
          exact
          policyName={policies.GetDcpReportApprovalHistory}
          component={DCPReportHistoryPage}
        />
        <ProtectedRoute 
          path={routes.MyDCPReport}
          exact
          policyName={policies.GetMyDcpReport}
          component={MyDCPReportPage}
        />
         <ProtectedRoute 
          path={routes.MyLRReport}
          exact
          policyName={policies.GetMyLRReport}
          component={LessonRegisterReport}
        />
        <ProtectedRoute 
          path={routes.MyDCPReportDetail}
          exact
          policyName={policies.GetDcpReportDetail}
          component={MyDCPReportPage}
        />
        <ProtectedRoute 
          path={routes.CreateDCPReport}
          exact
          policyName={policies.CreateNewDcpReport}
          component={DCPReportCreatePage}
        />
        <ProtectedRoute 
          path={routes.CreateLRReport}
          exact
          policyName={policies.CreateNewLRReport}
          component={LessonRegisterReportCreate}
        />
        <ProtectedRoute 
          path={routes.UpdateDCPReport}
          exact
          policyName={policies.UpdateDcpReport}
          component={DCPReportUpdatePage}
        />
        <ProtectedRoute 
          path={routes.DCPReportSchedule}
          exact
          policyName={policies.GetScheduleList}
          component={DCPReportSchedule}
        />
        <ProtectedRoute
          path={routes.DCPReportScheduleAssignment}
          exact
          policyName={policies.AssignDcpReport}
          component={DCPReportScheduleAssignment}
        />
        <ProtectedRoute 
          path={routes.LRReportSchedule}
          exact
          policyName={policies.AssignLessonRegisterReport}
          component={LessonRegisterReportSchedule}
        />
        <ProtectedRoute 
          path={routes.LRReportScheduleAssignment}
          exact
          policyName={policies.AssignLessonRegisterReport}
          component={LessonRegisterReportScheduleAssignment}
        />
        <ProtectedRoute 
          path={routes.DCPRanking}
          exact
          policyName={policies.Rankings}
          component={DCPRankingPage}
        />
        <ProtectedRoute 
          path={routes.DCPStatistics}
          exact
          policyName={policies.Statistics}
          component={DCPStatisticsPage}
        />
        <ProtectedRoute 
          path={routes.Profile}
          // policyName={policies.Courses}
          component={ProfilePage}
        />
        <ProtectedRoute
          path={routes.CoursesManager} 
          exact
          policyName={policies.Courses}
          component={CoursesPage}
        />
        <ProtectedRoute 
          path={routes.ClassesManager}
          policyName={policies.Courses}
          component={ClassesPage}
        />
        <ProtectedRoute 
          path={routes.StudentsManager}
          policyName={policies.Courses}
          component={StudentsPage}
        />
        <ProtectedRoute 
          path={routes.TeachersManager}
          policyName={policies.Courses}
          component={TeachersPage}
        />
        <ProtectedRoute 
          path={routes.GradesManager}
          policyName={policies.Courses}
          component={GradesPage}
        />
         <ProtectedRoute 
          path={routes.RegulationManager}
          policyName={policies.Courses}
          component={RegulationsPage}
        />
        <ProtectedRoute 
          path={routes.UsersManager}
          policyName={policies.AbpIdentityUsers}
          component={UserManagement}
        />
        <ProtectedRoute 
          path={routes.RolesManager}
          policyName={policies.AbpIdentityRoles}
          component={RoleManagement}
        />
        <Route 
          path='/errors'
          component={ErrorPage}
        />
        <Redirect to={routes.Dashboard} />
      </Switch>
    </Router>
  );
};

export default DashboardRouter;