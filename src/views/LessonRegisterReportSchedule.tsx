/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Container, Grid, Typography, IconButton, Paper } from '@material-ui/core';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, Identity, TaskAssignment, User, Util } from '../interfaces';
import { ClassesService, IdentityService, TaskAssignmentService } from '../api';
import { getDayOfWeek, formatTime, formatDate } from '../utils/TimeHelper';
import { taskType } from '../appConsts';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import EditIcon from '@material-ui/icons/Edit';
import { routes } from '../routers/routesDictionary';
import { DataGrid, GridApi, GridCellParams, GridColDef, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import ActionModal from '../components/Modal';
import UpdateLRKeeperRequest from '../components/Modal/UpdateLRKeeperRequest';
import { toast } from 'react-toastify';
import useStyles from '../assets/jss/views/LessonRegisterReportSchedule';


interface IAssignClass {
  classId: string;
  user?: TaskAssignment.UserProfleForTaskAssignmentDto;
  assigned: boolean;
}

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {

  return (
    <Grid container justify="center">
      <IconButton
        size="small"
        style={{ marginLeft: -16 }}
        >
        <EditIcon />
      </IconButton>
    </Grid>
  );
};


const cols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mã',
    hide: true
  },
  {
    field: 'classAssigned',
    headerName: 'Lớp trực',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as Class.ClassForSimpleListDto;
      return value.name;
    }
  },
  {
    field: 'assignee',
    headerName: 'Cờ đỏ chấm ',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as TaskAssignment.UserProfleForTaskAssignmentDto;
      return value.name;
    },
  },
  {
    field: 'belongsToClass',
    headerName: 'Thuộc lớp ',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.getValue('assignee') as TaskAssignment.UserProfleForTaskAssignmentDto;
      return value.class.name;
    },
  },
  {
    field: 'startTime',
    headerName: 'Bắt đầu từ',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as Date;
      return formatDate(value.toLocaleString());
    }
  },
  {
    field: 'endTime',
    headerName: 'Đến',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as Date;
      return formatDate(value.toLocaleString());
    }
  },
  {
    field: 'edit',
    headerName: 'Cập nhật',
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: RowMenuCell,
  }
];


const LessonRegisterReportSchedule = () => {

  const classes = useStyles();

  const [ updatedTime, setUpdatedTime] = useState<Date>();
  const [ creatorInfo, setCreatorInfo ] = useState<User.UserForSimpleListDto>();

  const [ userData, setUserData ] = useState<Identity.UserForTaskAssignmentDto[]>([]);
  const [ classData, setClassData ] = useState<Class.ClassForSimpleListDto[]>([]);
  const [ assignClasses, setAssignClasses ] = useState<IAssignClass[]>([]);

  const [ data, setData ] = useState<TaskAssignment.TaskAssignmentDto[]>([]);
  const [ loading, setLoading ] = useState(true);


  useEffect(() => {
    
    document.title = '2Cool | Phân công nộp sổ đầu bài';
    getData();

  }, []);

  const getData = async () => {
    setLoading(true);
    const promises: [
      Promise<Util.PagingModel<Class.ClassForSimpleListDto>>,
      Promise<Util.PagingModel<Identity.UserForTaskAssignmentDto>>,
      Promise<Util.PagingModel<TaskAssignment.TaskAssignmentDto>>
    ] = [
      ClassesService.getClassForSimpleList(),
      IdentityService.getUsersForTaskAssignment(),
      TaskAssignmentService.getAll({taskType: taskType.LessonRegisterReport})
    ];

    const [classRes, userRes, taskAssignRes] = await Promise.all(promises);

    // schedule
    setData(taskAssignRes.items);
    
    setClassData(classRes.items);
    setUserData(userRes.items);
    parseAssignmentScheduleData(classRes.items, taskAssignRes.items);
    setLoading(false);
  };

  const parseAssignmentScheduleData = (classItems: Class.ClassForSimpleListDto[],
    taskAssignItems: TaskAssignment.TaskAssignmentDto[]) => {

    if (taskAssignItems.length > 0) {
      const firstItem = taskAssignItems[0];
      setCreatorInfo(firstItem.creator);
      setUpdatedTime(firstItem.creationTime);
    }

    const assigns: IAssignClass[] = [];

    classItems.forEach(el => {
      const status = taskAssignItems.find((x) => x.classAssigned.id === el.id);
      assigns.push({
        classId: el.id,
        assigned: status ? true : false,
        user: status?.assignee
      });
    });
    
    setAssignClasses(assigns);
  };
  
  const handleSubmit = async (assigment: IAssignClass[]) => {
    try {
      const body: TaskAssignment.CreateUpdateTaskAssignmentDto = {
        items: [],
        taskType: taskType.LessonRegisterReport
      };

      body.items = assigment.map(x => ({
        assigneeId: x.user!.id,
        classId: x.classId,
        startTime: new Date(),
        endTime: new Date()
      }));

      await TaskAssignmentService.createUpdate(body);
      
      toast.success('Phân công thành công!');

    } catch (err) {
      console.log(err);
      toast.error('Đã có lỗi xảy ra! Không thể lưu phân công!');
    }
  };

  const onUpdateAssignment = async ({ classId, userId } : {
    classId: string; userId: string;
  }) =>  {
    const newAssignment = [...assignClasses];
    const assign = newAssignment.find(x => x.classId === classId);
    const user = userData.find(x => x.userProfileId === userId);
    const userProfile = {
      id: user!.userProfileId,
      name: user!.name,
      phoneNumber: user!.phoneNumber,
      class: user!.class
    };
    if (assign) {
      assign.assigned = true;
      assign.user = userProfile;
    } else {
      newAssignment.push({
        assigned: true,
        classId: classId,
        user: userProfile,
      });
    }
    setAssignClasses(newAssignment);
    await handleSubmit(newAssignment);
    setLoading(true);
    const newDataRes = await TaskAssignmentService.getAll({taskType: taskType.LessonRegisterReport});
    setData(newDataRes.items);
    parseAssignmentScheduleData(classData, newDataRes.items);
    setLoading(false);
  };

  const handleEditAssignment = (classId: string) => {

    const classItem = classData.find(x => x.id === classId);
    if (classItem) {

      const assign = assignClasses.find(x => x.classId === classId);

      ActionModal.show({
        title: `Chọn học sinh giữ sổ đầu bài cho ${classItem.name}`,
        onAccept: onUpdateAssignment,
        acceptText: "Lưu phân công",
        component: <UpdateLRKeeperRequest 
          classId={classId}
          assignedStudentId={assign?.user?.id}
          />
      });
    }
  };

  const timeText = 'Cập nhật lần cuối vào ' + (updatedTime ? `${getDayOfWeek(updatedTime.toLocaleString())} - ${formatTime(updatedTime.toLocaleString())}` : 'Không xác định');
  const creatorText = creatorInfo ? `Phân công bởi ${creatorInfo.name}` : 'Chưa được ai phân công';

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.LRReportSchedule} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Grid item >
            <Header
              pageName="Phân công giữ sổ đầu bài"
            />
          </Grid>

          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
            <Grid item container
              style={{
                paddingTop: 16, 
                paddingRight: 24, 
                paddingLeft: 24,
                background: "#e8e8e8"
              }}
            >
              <Paper variant="outlined" elevation={1} style={{ width: "100%" }}>
                <Grid item container direction='row' alignItems='center' style={{ padding: "5px 32px", height: 54 }}>
                  <Grid item container direction={'row'} alignItems={'center'}>
                    <AlarmIcon style={{ marginRight: 8 }}/>
                    <Typography variant={'body2'}>{timeText}</Typography>
                  </Grid>
                  <Grid item container direction={'row'} alignItems={'center'}>
                    <PermContactCalendarIcon style={{ marginRight: 8 }}/>
                    <Typography variant={'body2'}>{creatorText}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>              
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8'}}>
              <Container className={classes.datagridContainer}>
                <DataGrid
                  columns={cols}
                  rows={data}
                  hideFooter
                  hideFooterPagination
                  loading={loading}
                  onCellClick={(params: GridCellParams) =>  {
                    if (params.colIndex === 5) {
                      const classItem = params.getValue('classAssigned') as Class.ClassForSimpleListDto
                      handleEditAssignment(classItem.id);
                    }
                  }}
                />
              </Container>
            </Grid>
          </Grid>

          {/* <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' style={{paddingTop: 12, paddingBottom: 12, flex: 1}}>
                <Grid item container direction={'row'} alignItems={'center'}>
                  <AlarmIcon style={{ marginRight: 8 }}/>
                  <Typography variant={'body2'}>{`Cập nhật lần cuối vào ${timeText}`}</Typography>
                </Grid>
                <Grid item container direction={'row'} alignItems={'center'}>
                  <PermContactCalendarIcon style={{ marginRight: 8 }}/>
                  <Typography variant={'body2'}>{creatorText}</Typography>
                </Grid>
              </Grid>
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: '1 1 0', minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0, overflowX: 'hidden', overflowY: 'auto' }}>
              <Container className={classes.datagridContainer}>
                <DataGrid
                  columns={cols}
                  rows={data}
                  hideFooter
                  hideFooterPagination
                  onCellClick={(params: GridCellParams) =>  {
                    if (params.colIndex === 5) {
                      const classItem = params.getValue('classAssigned') as Class.ClassForSimpleListDto
                      handleEditAssignment(classItem.id);
                    }
                  }}
                />
              </Container>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default LessonRegisterReportSchedule;