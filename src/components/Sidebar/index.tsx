import { FC, useState, useEffect } from 'react';
import { Box, Collapse, Container, List, ListItem, ListItemText } from '@material-ui/core';
import { Dashboard } from '@material-ui/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import HistoryIcon from '@material-ui/icons/History';
import useSidebarStyles from '../../assets/jss/components/Sidebar/sidebarStyles';
import { withRedux } from '../../utils/ReduxConnect';
import { Util } from '../../interfaces';
import { policies } from '../../appConsts';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CreateIcon from '@material-ui/icons/Create';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FlagIcon from '@material-ui/icons/Flag';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookIcon from '@material-ui/icons/Book';
import TeacherIcon from '../../assets/img/teacher.svg';
import StudentIcon from '../../assets/img/student.svg';
import RoleIcon from '../../assets/img/permission.svg';
import UserIcon from '../../assets/img/user.svg';
// import { ReactComponent as UserIcon } from '../../assets/img/user.svg';

interface ISidebarInfo {
  key: string;
  title: string;
  Icon: any;
  route: string;
  policyName: string;
  subItems?: ISidebarInfo[];
}

const sidebarItems: Util.IObject<ISidebarInfo[]> = {
  admin: [
    {
      key: 'courses',
      title: 'Khóa học',
      Icon: FlagIcon,
      route: '/admin/courses',
      policyName: policies.Courses
    },
    {
      key: 'teachers',
      Icon: TeacherIcon,
      title: 'Giáo viên',
      route: '/admin/teachers',
      policyName: policies.Courses
    },
    {
      key: 'classes',
      Icon: LocalLibraryIcon,
      title: 'Lớp học',
      route: '/admin/classes',
      policyName: policies.Courses
    },
    {
      key: 'students',
      Icon: StudentIcon,
      title: 'Học sinh',
      route: '/admin/students',
      policyName: policies.Courses
    },
    {
      key: 'grades',
      Icon: BookIcon,
      title: 'Khối',
      route: '/admin/grades',
      policyName: policies.Courses
    },
    {
      key: 'users',
      Icon: UserIcon,
      title: 'Người dùng',
      route: '/admin/users',
      policyName: policies.AbpIdentityUsers
    },
    {
      key: 'roles',
      Icon: RoleIcon,
      title: 'Quyền',
      route: '/admin/roles',
      policyName: policies.AbpIdentityRoles
    }
  ],
  dashboard: [
    {
      key: 'dashboard',
      title: 'Trang chủ',
      Icon: Dashboard,
      route: '/dashboard',
      policyName: ''
    },
    {
      key: 'dcp-report-approval',
      Icon: CheckCircleIcon,
      title: 'Duyệt',
      route: '/dcp-report-approval',
      policyName: policies.DcpReportApproval
    },
    {
      key: 'dcp-report-history',
      Icon: HistoryIcon,
      title: 'Lịch sử duyệt',
      route: '/dcp-report-history',
      policyName: policies.GetDcpReportApprovalHistory
    },
    {
      key: 'my-report',
      Icon: CreateIcon,
      title: 'Chấm điểm',
      route: '/my-dcp-report',
      policyName: policies.CreateNewDcpReport,
    },
    {
      key: 'my-dcp-report-post',
      Icon: CreateIcon,
      title: 'Chấm điểm',
      route: '/',
      policyName: policies.CreateNewDcpReport,
      subItems: [
        {
          key: 'my-dcp-report',
          Icon: AssignmentTurnedInIcon,
          title: 'Chấm điểm nề nếp',
          route: '/my-dcp-report',
          policyName: policies.CreateNewDcpReport,
        },
        {
          key: 'my-lr-report',
          Icon: ImportContactsIcon,
          title: 'Sổ đầu bài',
          route: '/my-lr-report',
          policyName: policies.CreateNewLRReport,
        }
      ]
    },
    {
      key: 'task-assignments',
      Icon: AssignmentIcon,
      title: 'Phân công',
      route: '/task-assignments',
      policyName: policies.GetScheduleList
    },
    {
      key: 'task-assignments-post',
      Icon: AssignmentIcon,
      title: 'Phân công',
      route: '',
      policyName: policies.GetScheduleList,
      subItems: [
        {
          key: 'report-schedule-assignment',
          Icon: AssignmentTurnedInIcon,
          title: 'Trực cờ đỏ',
          route: '/dcp-report-schedules',
          policyName: policies.AssignDcpReport
        },
        {
          key: 'lessons-register-report-schedule-assignment',
          Icon: ImportContactsIcon,
          title: 'Nộp sổ đầu bài',
          route: '/lesson-register-report-schedules',
          policyName: policies.AssignLessonRegisterReport
        }
      ]
    },
    {
      key: 'dcp-rankings',
      Icon: EqualizerIcon,
      title: 'Xếp hạng',
      route: '/dcp-rankings',
      policyName: policies.Rankings
    },
    {
      key: 'dcp-statistics',
      Icon: ShowChartIcon,
      title: 'Thống kê',
      route: '/dcp-statistics',
      policyName: policies.Statistics
    }
  ]
};

interface OwnProps {
  activeKey?: string;
}

type Props = OwnProps & {
  grantedPolicies: Util.IObject<boolean>
}

const Sidebar: FC<Props> = ({ activeKey, grantedPolicies }) => {

  const styles = useSidebarStyles();
  const history = useHistory();
  const location = useLocation();

  const [expandTaskAssignment, setExpandTaskAssignment] = useState(
    location.pathname.includes('/dcp-report-schedules') ||
    location.pathname.includes('/lesson-register-report-schedules')
  );

  const [expandCreateReport, setExpandCreateReport] = useState(
    location.pathname.includes('/my-dcp-report') ||
    location.pathname.includes('/my-lr-report')
  );
  
  useEffect(() => {
    if (activeKey && [
      'report-schedule-assignment', 
      'lessons-register-report-schedule-assignment'
    ].includes(activeKey)) {
      setExpandTaskAssignment(true);
    }
  }, [activeKey]);
  
  return (
    <Container className={styles.container}>
      <Box className={styles.filterBackground}></Box>
      <Box className={styles.titleWrapper}>
        <h1 onClick={() => history.push('dashboard')}>2Scool</h1>
      </Box>
      <List component='nav'>
        {
          sidebarItems[location.pathname.startsWith('/admin') ? 'admin' : 'dashboard'].map(item => 
            ((grantedPolicies && grantedPolicies[item.policyName] === true) || item.policyName === '') && (
              item.key === 'task-assignments' ? (
                <ListItem 
                  key={item.key}
                  button
                  onClick={() =>  setExpandTaskAssignment((prevOpen) => !prevOpen)} 

                >
                  <item.Icon style={{marginRight: 8, marginBottom: 4, color: '#fff', fill: '#fff'}} />
                  <ListItemText primary={item.title} />
                  {
                    expandTaskAssignment ? 
                    <ExpandLessIcon fontSize='small'/> :
                    <ExpandMoreIcon fontSize='small'/>
                  }
                </ListItem>
              ) : item.key === 'my-dcp-report' ? (
                <ListItem 
                  key={item.key}
                  button
                  onClick={() => setExpandCreateReport((prevOpen) => !prevOpen)} 

                >
                  <item.Icon style={{marginRight: 8, marginBottom: 4, color: '#fff', fill: '#fff'}} />
                  <ListItemText primary={item.title} />
                  {
                    expandCreateReport ? 
                    <ExpandLessIcon fontSize='small'/> :
                    <ExpandMoreIcon fontSize='small'/>
                  }
                </ListItem>
              ) :
              item.key === 'task-assignments-post' ? (
                <Collapse component="li" in={expandTaskAssignment} timeout="auto" unmountOnExit>
                  <List disablePadding>
                      {
                        item.subItems && item.subItems.map(el => (
                          <ListItem 
                            button
                            className={`${styles.listItem} ${el.key === activeKey ? styles.listItemActive : ''}`}
                            component={Link} 
                            to={el.route}
                            key={el.key} style={{paddingLeft: 32}} >
                            <el.Icon fontSize='small' style={{marginRight: 8, marginBottom: 4}} />
                            <ListItemText primary={el.title} className={styles.subMenuItem} />
                          </ListItem>
                        ))
                      }
                  </List>
                </Collapse>
              ) : 
              item.key === 'my-dcp-report-post' ? (
                <Collapse component="li" in={expandCreateReport} timeout="auto" unmountOnExit>
                  <List disablePadding>
                      {
                        item.subItems && item.subItems.map(el => (
                          <ListItem 
                            button
                            className={`${styles.listItem} ${el.key === activeKey ? styles.listItemActive : ''}`}
                            component={Link} 
                            to={el.route}
                            key={el.key} style={{paddingLeft: 32}} >
                            <el.Icon fontSize='small' style={{marginRight: 8, marginBottom: 4}} />
                            <ListItemText primary={el.title} className={styles.subMenuItem} />
                          </ListItem>
                        ))
                      }
                  </List>
                </Collapse>
              ) : (
                <ListItem
                  button 
                  className={`${styles.listItem} ${item.key === activeKey ? styles.listItemActive : ''}`}
                  component={Link}
                  to={item.route}
                  key={item.key}
                >
                  <item.Icon  style={{marginRight: 8, marginBottom: 4, width: 24, height: 24}} />
                  <ListItemText primary={item.title} />
                </ListItem>
              )
            )
          )
        }
      </List>
      <Box className={styles.copyRight}>
        <p>&copy; 2021 2Scool<br/>All rights reserved.</p>
      </Box>
    </Container>
  )
};

export default withRedux<OwnProps>({
  component: Sidebar,
  stateProps: (state: any) => ({
    grantedPolicies: state.appConfig?.appConfig?.auth?.grantedPolicies
  })
});