import { FC, Fragment, useEffect, useState } from 'react';
import { Box, Grid, Collapse, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { Dashboard } from '@material-ui/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Location } from 'history';
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
import { ReactComponent as LrBookIcon } from '../../assets/img/lesson-register.svg';
import { ReactComponent as IdentityIcon } from '../../assets/img/identity.svg';
import { ReactComponent as MultitenancyIcon } from '../../assets/img/multitenancy.svg';
import { routes } from '../../routers/routesDictionary';
import { AppConfigSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import useSidebarStyles from '../../assets/jss/components/Sidebar/sidebarStyles';

interface AccessResolver {
  (grantedPolicies: Util.IObject<boolean>): boolean;
}

interface IMenuItem {
  key?: string;
  title?: string;
  Icon?: any;
  route?: string;
  policyName?: string | AccessResolver;
  subItems?: IMenuItem[];
  showSeparator?: boolean;
}

const menuItems: IMenuItem[] = [
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
    key: routes.LRReportApproval,
    Icon: LrBookIcon,
    title: 'Duyệt sổ đầu bài',
    route: routes.LRReportApproval,
    policyName: policies.LRReportApproval
  },
  {
    key: 'my-report',
    Icon: CreateIcon,
    title: 'Chấm điểm',
    policyName: policies.CreateNewDcpReport,
    showSeparator: true,
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
    policyName: policies.Rankings,
    showSeparator: true,
  },
  {
    key: routes.DCPStatistics,
    Icon: ShowChartIcon,
    title: 'Thống kê',
    route: routes.DCPStatistics,
    policyName: policies.Statistics
  },
  // {
  //   key: 'quan-ly-khoa-hoc',
  //   Icon: FlagIcon,
  //   title: 'Khóa học',
  //   showSeparator: true,
  //   policyName: policies.Courses,
  //   subItems: [
      
  //   ]
  // },
  {
    key: routes.CoursesManager,
    title: 'Khóa học',
    Icon: FlagIcon,
    route: routes.CoursesManager,
    policyName: policies.Courses,
    showSeparator: true,
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
  // {
  //   key: 'identity',
  //   Icon: IdentityIcon,
  //   title: 'Danh tính',
  //   policyName: (p) => p[policies.AbpIdentityUsers] || p[policies.AbpIdentityRoles], 
  //   subItems: [
  //     {
  //       key: routes.UsersManager,
  //       Icon: UserIcon,
  //       title: 'Người dùng',
  //       route: routes.UsersManager,
  //       policyName: policies.AbpIdentityUsers
  //     },
  //     {
  //       key: routes.RolesManager,
  //       Icon: RoleIcon,
  //       title: 'Vai trò',
  //       route: routes.RolesManager,
  //       policyName: policies.AbpIdentityRoles
  //     },
  //   ],
  // },
  {
    key: routes.UsersManager,
    Icon: UserIcon,
    title: 'Người dùng',
    route: routes.UsersManager,
    policyName: policies.AbpIdentityUsers,
    showSeparator: true,
  },
  {
    key: routes.RolesManager,
    Icon: RoleIcon,
    title: 'Vai trò',
    route: routes.RolesManager,
    policyName: policies.AbpIdentityRoles
  },
  {
    key: routes.TenansManager,
    Icon: MultitenancyIcon,
    title: 'Khách thuê',
    route: routes.TenansManager,
    policyName: policies.AbpTenantManagementTenants,
    showSeparator: true,
  }
];

interface IMenuItemProps {
  item: IMenuItem;
  grantedPolicies: Util.IObject<boolean>;
  activeKey?: string;
  expand?: boolean;
  onToggleExpand?: (key: string) => void;
}

const MenuItem: FC<IMenuItemProps> = ({
  item, 
  grantedPolicies,
  activeKey,
  expand,
  onToggleExpand = () => {},
}) => {

  const styles = useSidebarStyles();

  const handleToggleExpand = () => {
    onToggleExpand(item.key || '');
  };

  const hasAccessRight = (): boolean =>  {
    if (!item.policyName) {
      return true;
    }
    if (typeof(item.policyName) === 'string') {
      return !item.policyName || (grantedPolicies && grantedPolicies[item.policyName]);
    }
    if (!!item.policyName.call) {
      return item.policyName(grantedPolicies);
    }
    return false;
  };

  const canAccess = hasAccessRight();

  if (canAccess) {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <Fragment>
          {item.showSeparator && <Divider light className={styles.divider} />}
          <ListItem 
            key={item.key}
            button
            className={styles.listItem}
            onClick={handleToggleExpand}
          >
            <Grid container justify="center" alignItems="center" className={styles.iconWrapper}>
              <item.Icon />
            </Grid>
            <ListItemText primary={item.title} />
            {
              expand ? <ExpandLessIcon fontSize='small'/> : <ExpandMoreIcon fontSize='small'/>
            }
          </ListItem>
          <Collapse component="li" in={expand} timeout="auto" unmountOnExit >
            <List disablePadding>
              {
                item.subItems.map((el, index) => (
                  <ListItem
                    key={`${el.key}${index}`}
                    button
                    className={`${styles.listItem} ${styles.subListItem} ${el.key === activeKey ? styles.listItemActive : ''}`}
                    component={Link} 
                    to={el.route!}
                    >
                      <Grid container justify="center" alignItems="center" className={styles.iconWrapper} style={{marginLeft: 0}}>
                        <el.Icon fontSize='small' />
                      </Grid>
                    <ListItemText primary={el.title} className={styles.subMenuItem} />
                  </ListItem>
                ))
              }
            </List>
          </Collapse>
        </Fragment>
      )
    }
    return (
      <Fragment>
        {item.showSeparator && <Divider light className={styles.divider} />}
        <ListItem
          button 
          className={`${styles.listItem} ${item.key === activeKey ? styles.listItemActive : ''}`}
          component={Link}
          to={item.route!}
          key={item.key!}
        >
          <Grid container justify="center" alignItems="center" className={styles.iconWrapper}>
            <item.Icon />
          </Grid>
          <ListItemText primary={item.title} />
        </ListItem>
      </Fragment>
    );
  }

  return null;
}

interface ISidebarProps {
}

const Sidebar: FC<ISidebarProps> = () => {

  const styles = useSidebarStyles();
  const history = useHistory();
  const location = useLocation();

  const [ expandKey, setExpandKey ] = useState<string | undefined>();
  const [ key, setKey ] = useState<string | undefined>();
  const grantedPolicies = useSelector(AppConfigSelector.grantedPolicies);

  useEffect(() => {
    // Init active menu item
    updateKeys(location);
    
    // Start listen on route change
    const unregister = history.listen((location) => {
      updateKeys(location);
    });

    return unregister;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateKeys = (location: Location<any>) => {
    const expr = (item: IMenuItem) => (item.route && location.pathname.startsWith(item.route)) as boolean;
    const expandKey = menuItems.find((item) => 
        item.subItems?.some(expr)
      )?.key;
    let activeKey = menuItems.find(expr)?.key;
    if (!activeKey) {
      activeKey = menuItems.filter(x => x.subItems && x.subItems.length > 0)
        .map(x => x.subItems!)
        .flat()
        .find(expr)?.key;
    }
    setExpandKey(expandKey);
    setKey(activeKey);
  };

  const onToggleExpand = (newKey: string) => {
    setExpandKey((prev) => prev === newKey ? undefined : newKey);
  };

  return (
    <Grid item md={2} container direction="column" className={styles.container}>
      <Box className={styles.titleWrapper}>
        <h1 onClick={() => history.push(routes.Dashboard)}>2Scool</h1>
      </Box>
        <List component='nav' className={`${styles.menuList} auto-hidden-scroll`}>
          {
            menuItems.map((item, index) => (
              <MenuItem
                key={index}
                activeKey={key}
                item={item}
                grantedPolicies={grantedPolicies}
                onToggleExpand={onToggleExpand}
                expand={item.key === expandKey}    
              />
            ))
          }
          <Divider light className={styles.divider} />
          <Box className={styles.copyRight}>
            <p>&copy; 2022 2Scool<br/>All rights reserved.</p>
          </Box>
        </List>
    </Grid>
  )
};

export default Sidebar;