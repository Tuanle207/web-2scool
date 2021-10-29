/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Button, makeStyles, List, ListItem, Typography, TextField } from '@material-ui/core';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, Identity, TaskAssignment, Util } from '../interfaces';
import { ClassesService, IdentityService, TaskAssignmentService } from '../api';
import { getDayOfWeek, formatTime } from '../utils/TimeHelper';
import { taskType } from '../appConsts';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import CheckIcon from '@material-ui/icons/Check';
import { Autocomplete } from '@material-ui/lab';
import { toast } from 'react-toastify';
import ActionModal from '../components/Modal';
import useStyles from '../assets/jss/views/LessonRegisterReportSchedule';
import { routes } from '../routers/routesDictionary';


interface IAssignClass {
  classId: string;
  user?: TaskAssignment.UserProfleForTaskAssignmentDto;
  assigned: boolean;
}

const AssignCard = ({
  index,
  selectedUser,
  onSelectedUserChange,
  userOptions,
  iclass,
  editable = false
}: {
  index: number;
  iclass: Class.ClassForSimpleListDto;
  userOptions: Identity.UserForTaskAssignmentDto[];
  selectedUser?: TaskAssignment.UserProfleForTaskAssignmentDto;
  onSelectedUserChange: (selectedUser: Identity.UserForTaskAssignmentDto | null) => void;
  editable: boolean;
}) => {

  const [ selected, setSelected ] = React.useState<Identity.UserForTaskAssignmentDto | null>(null);

  React.useEffect(() => {
    if (selectedUser) {
      const user = userOptions.find(x => x.userProfileId === selectedUser?.id);
      if (user) {
        setSelected(user);
      }
    }
  }, []);

  const handleOnChange = (value: Identity.UserForTaskAssignmentDto | null) => {
    setSelected(value);
      onSelectedUserChange(value);
  };
  

  return (
    <Grid container justify='center' alignItems='center' >
      <p>{iclass.name}</p>
      <Autocomplete
        id={`lr-report-schedule-${index}`}
        disabled={!editable}
        style={{width: 300, marginLeft: 32}}
        options={userOptions.sort((x, y) => x.name.localeCompare(y.name))}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.id === value.id}
        value={selected}
        onChange={(e, newValue) => handleOnChange(newValue)}
        size='small'
        renderInput={(params) => (
          <TextField {...params} 
            variant='outlined' 
            label='Học sinh giữ sổ đầu bài' 
            placeholder='Chọn học sinh' 
          />
        )}
      />
    </Grid>
  );
};



const LessonRegisterReportSchedule = () => {

  const classes = useStyles();

  const [updatedTime, setUpdatedTime] = React.useState(new Date());
  const [creatorInfo, setCreatorInfo] = React.useState<Util.IObject>({});

  const [userData, setUserData] = React.useState<Identity.UserForTaskAssignmentDto[]>([]);
  const [classData, setClassData] = React.useState<Class.ClassForSimpleListDto[]>([]);
  const [assignClasses, setAssignClasses] = React.useState<IAssignClass[]>([]);
  const [date, setDate] = React.useState(new Date());
  const [edit, setEdit] = React.useState(false);


  React.useEffect(() => {
    
    document.title = '2Cool | Phân công nộp sổ đầu bài';
    getData();

  }, []);


  const getData = async () => {
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
    setClassData(classRes.items);
    setUserData(userRes.items);

    const assigns: IAssignClass[] = [];

    classRes.items.forEach(el => {
      const status = taskAssignRes.items.find((x) => x.classAssigned.id === el.id);
      assigns.push({
        classId: el.id,
        assigned: status ? true : false,
        user: status?.assignee
      });
    });
   
    if (taskAssignRes.items.length > 0) {
      const firstItem = taskAssignRes.items[0];
      setDate(firstItem.creationTime);
    }
    setAssignClasses(assigns);
  };
  
  const getClass = (classId: string) => {
    return classData.find(x => x.id === classId);
  };

  const handleSubmit = () => {

    if (!edit) {
      setEdit(true);
      return;
    }

    // no unassigned class
    if (assignClasses.findIndex(x => x.assigned === false || !x.user) !== -1) {
      return toast.info('Vui lòng phân công đầy đủ cho các lớp trước khi lưu!', {
        autoClose: 5000
      });
    }

    // oke
    ActionModal.show({
      title: 'Xác nhận cập nhật phân công giữ sổ đầu bài?',
      onAccept: async () => {
        try {
          const body: TaskAssignment.CreateUpdateTaskAssignmentDto = {
            items: [],
            taskType: taskType.LessonRegisterReport
          };

          body.items = assignClasses.map(x => ({
            assigneeId: x.user!.id,
            classId: x.classId,
            startTime: new Date(),
            endTime: new Date()
          }));

          await TaskAssignmentService.createUpdate(body);
          
          toast.success('Phân công lịch trực cờ đỏ thành công!');

          setEdit(false);
        } catch (err) {
          console.log(err);
          toast.error('Đã có lỗi xảy ra! Không thể lưu phân công!');
        }
      }
    });
  }
  
  const handleSelectedUserItemChange = (classId: string, selectedUser: Identity.UserForTaskAssignmentDto  | null) => {
    const assign = [...assignClasses];
    const item = assign.find(x => x.classId === classId);
    console.log({item});
    if (item && selectedUser) {
      item.assigned = true;
      item.user = {
        id: selectedUser.userProfileId,
        name: selectedUser.name,
        class: selectedUser.class,
        phoneNumber: selectedUser.phoneNumber
      }
    }
    setAssignClasses(assign);
  };

  React.useEffect(() => {
    console.log({assignClasses});
  }, [assignClasses]);

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.LRReportSchedule} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' style={{paddingTop: 12, paddingBottom: 12, flex: 1}}>
                <Grid item container direction={'row'} alignItems={'center'}>
                  <AlarmIcon style={{ marginRight: 8 }}/>
                  <Typography variant={'body2'}>{`Cập nhật lần cuối vào ${getDayOfWeek(updatedTime.toLocaleString())} - ${formatTime(updatedTime.toLocaleString())}`}</Typography>
                </Grid>
                <Grid item container direction={'row'} alignItems={'center'}>
                  <PermContactCalendarIcon style={{ marginRight: 8 }}/>
                  <Typography variant={'body2'}>{`Phân công bởi Lê Anh Tuấn`}</Typography>
                </Grid>
              </Grid>
              <Button 
                variant={'contained'} 
                color={'primary'}
                style={{marginLeft: 'auto'}}
                onClick={handleSubmit}
                endIcon={edit && <CheckIcon />}
              >
                {edit ?  'Lưu phân công' : 'Cập nhật phân công'}
              </Button>
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: '1 1 0', minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0, overflowX: 'hidden', overflowY: 'auto' }}>
              <Container className={classes.datagridContainer}>
                <List>
                  {
                    assignClasses
                      .sort((x, y) => 
                        getClass(x.classId)!.name.localeCompare(getClass(y.classId)!.name))
                      .map((el, index) => (
                      <ListItem key={el.classId}>
                        <AssignCard 
                          index={index}
                          iclass={getClass(el.classId)!}
                          userOptions={userData.filter(x => x.class.id === el.classId)}
                          selectedUser={el.user} 
                          onSelectedUserChange={(value) => handleSelectedUserItemChange(el.classId, value)}
                          editable={edit}
                          />
                      </ListItem>
                    ))
                  }
                 
                </List>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LessonRegisterReportSchedule;