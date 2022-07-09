import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
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
import DCPReportHistoryPage from '../views/LRReportApprovalPage';
import DCPRankingPage from '../views/DCPRankingPage';
import DCPStatisticsPage from '../views/DCPStatisticsPage';
import ErrorPage from '../views/ErrorPage';
import DCPReportUpdatePage from '../views/DCPReportUpdatePage';
import DCPReportSchedule from '../views/DCPReportSchedule';
import DCPReportScheduleAssignment from '../views/DCPReportScheduleAssignment';
import LessonRegisterReportSchedule from '../views/LessonRegisterReportSchedule';
import MyLRReportPage from '../views/MyLRReportPage';
import LessonRegisterReportCreate from '../views/LessonRegisterReportCreate';
import LessonRegisterReportUpdate from '../views/LessonRegisterReportUpdate';
import ProfilePage from '../views/ProfilePage';
import RegulationsPage from '../views/RegulationsPage';
import TenantManagement from '../views/TenantManagement';
import Sidebar from '../components/Sidebar';
import CriteriasPage from '../views/CriteriasPage';
import AppSettingPage from '../views/AppSettingPage';
import { policies } from '../appConsts';
import { routes } from './routesDictionary';

const DashboardRouteDictionary = () => {
  return (
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
        path={routes.DCPReportDetail}
        exact
        policyName={policies.GetDcpReportDetail}
        component={DCPReportPage}
      />
      <ProtectedRoute 
        path={routes.LRReportApproval}
        exact
        policyName={policies.LRReportApproval}
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
        component={MyLRReportPage}
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
        path={routes.UpdateLRReport}
        exact
        policyName={policies.UpdateLRReport}
        component={LessonRegisterReportUpdate}
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
        policyName={policies.CoursesStudents}
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
        policyName={policies.Rules}
        component={RegulationsPage}
      />
      <ProtectedRoute
        path={routes.CriteriaManager}
        policyName={policies.Rules}
        component={CriteriasPage}
      />
      <ProtectedRoute
        path={routes.SettingManager}
        policyName={policies.Rules}
        component={AppSettingPage}
      />
      <ProtectedRoute 
        path={routes.UsersManager}
        policyName={policies.AbpIdentityUsersGet}
        component={UserManagement}
      />
      <ProtectedRoute 
        path={routes.RolesManager}
        policyName={policies.AbpIdentityRoles}
        component={RoleManagement}
      />
      <ProtectedRoute 
        path={routes.TenansManager}
        policyName={policies.AbpTenantManagementTenants}
        component={TenantManagement}
      />
      <Route 
        path='/da-co-loi-xay-ra'
        component={ErrorPage}
      />
      <Redirect to={routes.Dashboard} />
    </Switch>
  );
};

const DashboardRouter = () => {

  return (
    <Router>
      <div style={{ height: '100%' }}>
        <Grid container direction="row" style={{ height: '100%', flexWrap: 'nowrap' }}>
          <Sidebar />
          <Grid style={{ flexGrow: 1, width: 'auto' }} item container>
            <DashboardRouteDictionary />
          </Grid>
        </Grid>
      </div>
    </Router>
  )
}

export default DashboardRouter;