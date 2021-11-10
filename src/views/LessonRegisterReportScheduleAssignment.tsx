/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Button, List, ListItem, Typography, TextField, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, Identity, TaskAssignment, Util } from '../interfaces';
import { ClassesService, IdentityService, TaskAssignmentService } from '../api';
import { getDayOfWeek, formatTime, formatDate } from '../utils/TimeHelper';
import { taskType } from '../appConsts';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import CheckIcon from '@material-ui/icons/Check';
import { Autocomplete } from '@material-ui/lab';
import { toast } from 'react-toastify';
import ActionModal from '../components/Modal';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/LessonRegisterReportSchedule';
import { DataGrid, GridColDef, GridValueFormatterParams, GridCellParams, GridApi, GridEditCellPropsParams } from '@material-ui/data-grid';
import Rating from '@material-ui/lab/Rating';

interface IAssignClass {
  classId: string;
  user?: TaskAssignment.UserProfleForTaskAssignmentDto;
  assigned: boolean;
}

const useStyles2 = makeStyles({
  root: {
    // flex: 1,
    width: "100%",
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    // paddingRight: 16,
  },
});

function RatingEditInputCell(props: GridCellParams) {
  const { id, value, api, field } = props;
  const classes = useStyles2();

  const [ userOptions, setuserOptions ] = useState<Identity.UserForTaskAssignmentDto[]>([])
  const [ selected, setSelected ] = React.useState<Identity.UserForTaskAssignmentDto | null>(null);
  

  useEffect(() => {
    const initData = async () => {
      const classItem = (api as GridApi).getCellValue(id, 'classAssigned') as Class.ClassForSimpleListDto;
      const classId = classItem.id;
      const { items } = await IdentityService.getUsersForTaskAssignment(classId);
      setuserOptions(items);
      setSelected(value as Identity.UserForTaskAssignmentDto);
    };
    initData();
  }, []);


  const handleOnChange = (value: Identity.UserForTaskAssignmentDto | null) => {
    let setValue = {...value};
    if (value === null) {
      setValue = userOptions[0];
    }
    setSelected(value);
    (api as GridApi).setEditCellProps({id, field, props: { value: setValue }});
    (api as GridApi).commitCellChange({ id, field, props: { value: setValue } });
    (api as GridApi).setCellMode(id, field, 'view');
  };

  // const handleRef = (element: any) => {
  //   if (element) {
  //     element.querySelector(`input[value="${value}"]`).focus();
  //   }
  // };

  return (
    <div className={classes.root}>
      <Autocomplete
        style={{ height: "100%" }}
        fullWidth
        options={userOptions.sort((x, y) => x.name.localeCompare(y.name))}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.id === value.id}
        value={selected}
        onChange={(e, newValue) => handleOnChange(newValue)}
        size="medium"
        renderInput={(params) => (
          <TextField
            {...params}
            style={{ height: "100%" }}
            variant='outlined' 
            placeholder='Chọn học sinh' 
          />
          // <input style={{height: 100}}  />
        )}
      />
    </div>
  );
}

function renderRatingEditInputCell(params: GridCellParams) {
  return <RatingEditInputCell {...params} />;
}


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
    renderEditCell: renderRatingEditInputCell,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as TaskAssignment.UserProfleForTaskAssignmentDto;
      return value.name;
    },
    editable: true,
  },
  {
    field: 'belongsToClass',
    headerName: 'Thuộc lớp ',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.getValue('assignee') as TaskAssignment.UserProfleForTaskAssignmentDto;
      return value.class.name;
    }
  },
];



const LessonRegisterReportScheduleAssignment = () => {

  const classes = useStyles();

  const [updatedTime, setUpdatedTime] = React.useState(new Date());
  const [creatorInfo, setCreatorInfo] = React.useState<Util.IObject>({});

  const [userData, setUserData] = React.useState<Identity.UserForTaskAssignmentDto[]>([]);
  const [classData, setClassData] = React.useState<Class.ClassForSimpleListDto[]>([]);
  const [assignClasses, setAssignClasses] = React.useState<IAssignClass[]>([]);
  const [date, setDate] = React.useState(new Date());
  const [edit, setEdit] = React.useState(false);

  const [ data, setData ] = useState<TaskAssignment.TaskAssignmentDto[]>([]);


  React.useEffect(() => {
    
    document.title = '2Cool | Phân công nộp sổ đầu bài';
    getData();

  }, []);

  useEffect(() => {
    console.log({data});
  }, [data]);


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

    // bonus
    setData(taskAssignRes.items);
    

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

  const onEditChange = (params: GridEditCellPropsParams, event?: React.SyntheticEvent<Element, Event> | undefined) => {
    console.log({params, event});
  };

  const onCellEditCommit = (params: GridEditCellPropsParams, event?: React.SyntheticEvent<Element, Event> | undefined) => {
    console.log({params, event});

    console.log("changing bro...");
    console.log({data});
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
                {/* <List>
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
                 
                </List> */}
                <DataGrid
                  columns={cols}
                  rows={data}
                  // loading={loading}
                  // error={error}
                  paginationMode='server'
                  hideFooter
                  hideFooterPagination
                  onEditCellChange={onEditChange}
                  onEditCellChangeCommitted={onCellEditCommit}
                />
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LessonRegisterReportScheduleAssignment;