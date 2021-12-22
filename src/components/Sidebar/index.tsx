import { FC, useState, useEffect } from 'react';
import { Box, Collapse, Container, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { Dashboard } from '@material-ui/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import HistoryIcon from '@material-ui/icons/History';
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
import { ReactComponent as TeacherIcon } from '../../assets/img/teacher.svg';
import { ReactComponent as StudentIcon } from '../../assets/img/student.svg';
import { ReactComponent as RoleIcon } from '../../assets/img/permission.svg';
import { ReactComponent as UserIcon } from '../../assets/img/user.svg';
import { ReactComponent as RegulationIcon } from '../../assets/img/regulation.svg';
import { routes } from '../../routers/routesDictionary';
import { AppConfigSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import useSidebarStyles from '../../assets/jss/components/Sidebar/sidebarStyles';

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
      key: routes.CoursesManager,
      title: 'Khóa học',
      Icon: FlagIcon,
      route: routes.CoursesManager,
      policyName: policies.Courses
    },
    {
      key: routes.TeachersManager,
      Icon: TeacherIcon,
      title: 'Giáo viên',
      route: routes.TeachersManager,
      policyName: policies.Courses
    },
    {
      key: routes.ClassesManager,
      Icon: LocalLibraryIcon,
      title: 'Lớp học',
      route: routes.ClassesManager,
      policyName: policies.Courses
    },
    {
      key: routes.StudentsManager,
      Icon: StudentIcon,
      title: 'Học sinh',
      route: routes.StudentsManager,
      policyName: policies.Courses
    },
    {
      key: routes.GradesManager,
      Icon: BookIcon,
      title: 'Khối',
      route: routes.GradesManager,
      policyName: policies.Courses
    },
    {
      key: routes.RegulationManager,
      Icon: RegulationIcon,
      title: 'Quy định nề nếp',
      route: routes.RegulationManager,
      policyName: policies.Courses
    },
    {
      key: routes.UsersManager,
      Icon: UserIcon,
      title: 'Người dùng',
      route: routes.UsersManager,
      policyName: policies.AbpIdentityUsers
    },
    {
      key: routes.RolesManager,
      Icon: RoleIcon,
      title: 'Vai trò',
      route: routes.RolesManager,
      policyName: policies.AbpIdentityRoles
    }
  ],
  dashboard: [
    {
      key: routes.Dashboard,
      title: 'Trang chủ',
      Icon: Dashboard,
      route: routes.Dashboard,
      policyName: ''
    },
    {
      key: routes.DCPReportApproval,
      Icon: CheckCircleIcon,
      title: 'Duyệt nề nếp',
      route: routes.DCPReportApproval,
      policyName: policies.DcpReportApproval
    },
    {
      key: routes.DCPReportHistory,
      Icon: HistoryIcon,
      title: 'Duyệt sổ đầu bài',
      route: routes.DCPReportHistory,
      policyName: policies.GetDcpReportApprovalHistory
    },
    {
      key: 'my-report',
      Icon: CreateIcon,
      title: 'Chấm điểm',
      route: routes.MyDCPReport,
      policyName: policies.CreateNewDcpReport,
    },
    {
      key: 'my-report-post',
      Icon: CreateIcon,
      title: 'Chấm điểm',
      route: '/',
      policyName: policies.CreateNewDcpReport,
      subItems: [
        {
          key: routes.MyDCPReport,
          Icon: AssignmentTurnedInIcon,
          title: 'Chấm điểm nề nếp',
          route: routes.MyDCPReport,
          policyName: policies.CreateNewDcpReport,
        },
        {
          key: routes.MyLRReport,
          Icon: ImportContactsIcon,
          title: 'Sổ đầu bài',
          route: routes.MyLRReport,
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
          key: routes.DCPReportSchedule,
          Icon: AssignmentTurnedInIcon,
          title: 'Trực cờ đỏ',
          route: routes.DCPReportSchedule,
          policyName: policies.AssignDcpReport
        },
        {
          key: routes.LRReportSchedule,
          Icon: ImportContactsIcon,
          title: 'Nộp sổ đầu bài',
          route: routes.LRReportSchedule,
          policyName: policies.AssignLessonRegisterReport
        }
      ]
    },
    {
      key: routes.DCPRanking,
      Icon: EqualizerIcon,
      title: 'Xếp hạng',
      route: routes.DCPRanking,
      policyName: policies.Rankings
    },
    {
      key: routes.DCPStatistics,
      Icon: ShowChartIcon,
      title: 'Thống kê',
      route: routes.DCPStatistics,
      policyName: policies.Statistics
    }
  ]
};

interface ISidebarProps {
  activeKey?: string;
}

const Sidebar: FC<ISidebarProps> = ({ activeKey }) => {

  const styles = useSidebarStyles();
  const history = useHistory();
  const location = useLocation();

  const [expandTaskAssignment, setExpandTaskAssignment] = useState(
    location.pathname.includes(routes.DCPReportSchedule) ||
    location.pathname.includes(routes.LRReportSchedule)
  );

  const [expandCreateReport, setExpandCreateReport] = useState(
    location.pathname.includes(routes.MyDCPReport) ||
    location.pathname.includes(routes.MyLRReport)
  );

  const grantedPolicies = useSelector(AppConfigSelector.grantedPolicies);

  useEffect(() => {
    if (activeKey && [
      'report-schedule-assignment', 
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
        <h1 onClick={() => history.push(routes.Dashboard)}>2Scool</h1>
      </Box>
      <List component='nav'>
        {
          sidebarItems[location.pathname.startsWith('/quan-ly') ? 'admin' : 'dashboard'].map((item) => 
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
              ) : item.key === 'my-report' ? (
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
              item.key === 'my-report-post' ? (
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
                <>
                  {
                    item.key === routes.UsersManager && <Divider light className={styles.divider} />
                  }
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
                </>
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

export default Sidebar;