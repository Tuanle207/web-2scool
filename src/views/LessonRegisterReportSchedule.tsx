/* eslint-disable react-hooks/exhaustive-deps */
import { 
  useEffect, 
  useMemo, 
  useState 
} from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Paper 
} from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import EditIcon from '@material-ui/icons/Edit';
import { 
  DataGrid, 
  GridApi, 
  GridCellParams, 
  GridColDef, 
  GridRowId, 
  GridValueFormatterParams 
} from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import moment from 'moment';
import Header from '../components/Header';
import { 
  Class, 
  Account, 
  TaskAssignment, 
  Util
 } from '../interfaces';
import { 
  ClassesService, 
  AccountsService, 
  TaskAssignmentService
 } from '../api';
import { 
  getDayOfWeek, 
  formatTime, 
  formatDate
 } from '../utils/TimeHelper';
import { 
  dataGridLocale, 
  taskType
 } from '../appConsts';
import UpdateLRKeeperRequest, { UpdateLRKeeperFormData } from '../components/Modal/UpdateLRKeeperRequest';
import { 
  useDialog
 } from '../hooks';
import useStyles from '../assets/jss/views/LessonRegisterReportSchedule';
import { IDialogOptions } from '../services';
import usePageTitleBarStyles from '../assets/jss/components/PageTitleBar/usePageTitleBarStyles';

interface IAssignClass {
  classId: string;
  account?: Account.SimpleAccountDto;
  assigned: boolean;
  startTime?: Date;
  endTime?: Date;
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
      const value = params.value as Account.SimpleAccountDto;
      return value.name ?? 'Chưa phân công';
    },
  },
  {
    field: 'belongsToClass',
    headerName: 'Thuộc lớp ',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.getValue('assignee') as Account.SimpleAccountDto;
      return value?.classDisplayName ?? 'Chưa phân công' ;
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
  const titleBarStyles = usePageTitleBarStyles();

  const [ updatedTime, setUpdatedTime] = useState<Date>();
  const [ creatorInfo, setCreatorInfo ] = useState<Account.SimpleAccountDto>();

  const [ accountData, setAccountData ] = useState<Account.SimpleAccountDto[]>([]);
  const [ classData, setClassData ] = useState<Class.ClassForSimpleListDto[]>([]);
  const [ assignClasses, setAssignClasses ] = useState<IAssignClass[]>([]);

  const [ data, setData ] = useState<TaskAssignment.TaskAssignmentDto[]>([]);
  const [ loading, setLoading ] = useState(true);

  const { showDialog } = useDialog<UpdateLRKeeperFormData>({
    type: 'data',
    renderFormComponent: UpdateLRKeeperRequest,
    acceptText: 'Lưu phân công',
  });

  useEffect(() => {
    
    document.title = '2Scool | Phân công nộp sổ đầu bài';
    getData();

  }, []);

  const getData = async (): Promise<void> => {
    try {
      setLoading(true);
      const promises: [
        Promise<Util.PagingModel<Class.ClassForSimpleListDto>>,
        Promise<Util.PagingModel<Account.SimpleAccountDto>>,
        Promise<Util.PagingModel<TaskAssignment.TaskAssignmentDto>>
      ] = [
        ClassesService.getClassForSimpleList(),
        AccountsService.getTaskAssignmentAccounts(),
        TaskAssignmentService.getAll({taskType: taskType.LessonRegisterReport})
      ];
  
      const [classRes, userRes, taskAssignRes] = await Promise.all(promises);
  
      setClassData(classRes.items);
      setAccountData(userRes.items);
      parseAssignmentScheduleData(classRes.items, taskAssignRes.items);
    } catch (err: any)  {
      toast.error('Đã có lỗi xảy ra khi khởi tạo dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const parseAssignmentScheduleData = (classItems: Class.ClassForSimpleListDto[],
    taskAssignItems: TaskAssignment.TaskAssignmentDto[]): void => {

    const scheData: TaskAssignment.TaskAssignmentDto[] = [];  
    if (taskAssignItems.length > 0) {
      const firstItem = taskAssignItems[0];
      setCreatorInfo(firstItem.creator);
      setUpdatedTime(firstItem.creationTime);
    }

    const assigns: IAssignClass[] = [];
    const startTime = taskAssignItems.length > 0 ? taskAssignItems[0].startTime : new Date();
    const endTime = taskAssignItems.length > 0  ? taskAssignItems[0].endTime : moment().add(1, 'y').toDate();

    classItems.forEach(el => {
      const status = taskAssignItems.find((x) => x.classAssigned.id === el.id);
      assigns.push({
        classId: el.id,
        assigned: status ? true : false,
        account: status?.assignee,
        startTime: status?.startTime,
        endTime: status?.endTime
      });

      const classSche = taskAssignItems.find(x => x.classAssigned.id === el.id);
      if (classSche) {
        scheData.push(classSche);
      } else {
        scheData.push({
          id: el.id,
          classAssigned: el,
          assignee: {} as Account.SimpleAccountDto,
          startTime,
          endTime
        } as TaskAssignment.TaskAssignmentDto);
      }
    });
    
    setData(scheData);
    setAssignClasses(assigns);
  };
  
  const handleSubmit = async (assigment: IAssignClass[]): Promise<void> => {
    try {
      const body: TaskAssignment.CreateUpdateTaskAssignmentDto = {
        items: [],
        taskType: taskType.LessonRegisterReport
      };
  
      body.items = assigment.filter(x => x.assigned).map(x => ({
        assigneeId: x.account!.id,
        classId: x.classId,
        startTime: x.startTime!,
        endTime: x.endTime!
      }));
  
      await TaskAssignmentService.createUpdate(body);
    } catch (err: any) {
      throw err;
    }
    
  };

  const updateAssignment = async ({ classId, accountId, startTime, endTime } : {
    classId: string; accountId: string; startTime: Date; endTime: Date;
  }): Promise<void> =>  {
    try {
      const newAssignment = [...assignClasses];
      const assign = newAssignment.find(x => x.classId === classId);
      const account = accountData.find(x => x.id === accountId);
      if (assign) {
        assign.assigned = true;
        assign.account = account;
        assign.startTime = startTime;
        assign.endTime = endTime;
      } else {
        newAssignment.push({
          assigned: true,
          classId: classId,
          account: account,
          startTime,
          endTime
        });
      }
      setAssignClasses(newAssignment);
      await handleSubmit(newAssignment);
      toast.success('Phân công thành công!');

      setLoading(true);
      const newDataRes = await TaskAssignmentService.getAll({taskType: taskType.LessonRegisterReport});
      setData(newDataRes.items);
      parseAssignmentScheduleData(classData, newDataRes.items);
      setLoading(false);
    } catch (err) {
      console.log({err});
      toast.error('Đã có lỗi xảy ra. Không thể lưu phân công!');
    }
  };

  const handleEditAssignment = async (classId: string): Promise<void> => {
    const classItem = classData.find(x => x.id === classId);
    if (classItem) {

      const assign = assignClasses.find(x => x.classId === classId);
      const initialData = {
        classId,
        assignedAccountId: assign?.account?.id,
        initStartTime:assign?.startTime,
        initEndTime: assign?.endTime
      };
      const options: IDialogOptions = {
        title: `Chọn học sinh giữ sổ đầu bài cho ${classItem.name}`,
      };
      const result = await showDialog(initialData, options);
      if (result.result === 'Ok' && result.data) {
        await updateAssignment(result.data);
      }
    }
  };

  const timeText = useMemo(() => 'Cập nhật lần cuối vào ' + 
    (updatedTime ? `${getDayOfWeek(updatedTime.toLocaleString())} - ${formatTime(updatedTime.toLocaleString())}` 
    : 'Không xác định'), [updatedTime]);
  const creatorText = useMemo(() => creatorInfo ? `Phân công bởi ${creatorInfo.name}` : 'Chưa được ai phân công', [creatorInfo]);

  return (
    <Grid style={{ height: '100%' }} item container direction={'column'}>
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
            <Grid item container direction='row' justify="space-between" alignItems="center" className={titleBarStyles.container}>
              <Grid item container direction={'row'} alignItems={'center'} style={{ marginRight: 'auto' }}>
                <AlarmIcon style={{ marginRight: 8 }}/>
                <Typography variant={'body2'}>{timeText}</Typography>
              </Grid>
              <Grid item container direction={'row'} alignItems={'center'} style={{ marginRight: 'auto' }}>
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
              localeText={dataGridLocale}
            />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LessonRegisterReportSchedule;