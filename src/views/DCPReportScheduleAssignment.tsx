/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, makeStyles, List, ListItem, Typography, IconButton, Menu, MenuItem, Chip, Tooltip, TextField, Paper, FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { TaskAssignment, Identity, Class, Util } from '../common/interfaces';
import { TaskAssignmentService, IdentityService, ClassesService } from '../common/api';
import ActionModal from '../components/Modal';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FaceIcon from '@material-ui/icons/Face';
import AlarmIcon from '@material-ui/icons/Alarm';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { taskType } from '../common/appConsts';
import { getDayOfWeek, formatTime, addDays, getPreviousMonday } from '../common/utils/TimeHelper';


const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    },
    '& .MuiPaper-rounded': {
      borderRadius: 0
    }
  },
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    // overflowY: 'scroll'
    // padding: '20px 100px' 
  },
  datagridContainer: {
    // height: '100%', 
    width: '100%',
    '& .MuiDataGrid-columnSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    },
    '& .MuiDataGrid-root': {
      border: 'none',
      '& .MuiDataGrid-withBorder': {
        borderRight: 'none',
      }
    },
    '& .MuiDataGrid-root.MuiDataGrid-colCellMoving': {
      backgroundColor: 'inherit'
    }
  },

  dateCardContainer: {
    padding: theme.spacing(1, 2), 
    border: '1px solid #000',
    boxShadow: '2px 2px 6px #000',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white
    }
  },
  dateCardContainerActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },

  dcpReportClassFilter: {
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(2), 
    borderTop: `1px solid ${theme.palette.divider}`,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minWidth: 0,
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  section: {
    padding: theme.spacing(0, 1),
    '&.MuiGrid-container': {
      width: 'auto'
    }
  },
  collapseSection: {
    '&.MuiGrid-container': {
      width: 0,
      overflow: 'hidden'
    }
  },
  growSection: {
    padding: theme.spacing(0, 1),
    flex: 1,
    '&.MuiGrid-container': {
      width: 'auto'
    }
  },
  filter: {
    // marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0, 1, 1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  classesSelector: {
    width: 200,
  },
  studentsSelector: {
    width: 300,
    marginLeft: theme.spacing(1)
  },
  selectedList: {
    height: 200,
    overflowX: 'auto'
  },
  selectedClassList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      // borderBottom: `1px solid ${theme.palette.grey[500]}`
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      borderBottomWidth: 0,
    },
    '& > li:hover': {
      borderColor: theme.palette.primary.main,
      '& p, & button': {
        // color: theme.palette.common.white,
      }
    }
  },
  selectedItem: {
    cursor: 'pointer',
    '& > p': {
      marginLeft: 20
    },
    '& *': {
      flexWrap: 'wrap !important'
    }
  },
  activeSelectedItem: {
    // borderBottomColor: `${theme.palette.primary.main} !important`,
    // borderColor: theme.palette.primary.main,
    '& p, & button, & svg': {
      color: theme.palette.primary.main
    },
  },
  removeItemBtn: {
    marginLeft: 'auto',
    '&:hover': {
      color: `${theme.palette.error.dark} !important`
    }
  },
  rulesCatSelector: {
    width: 160,
  },
  rulesSelector: {
    width: 300,
    marginLeft: theme.spacing(2)
  },
  emptySelectedList: {
    padding: theme.spacing(1, 4),
    '& > p': {
      color: theme.palette.grey[500]
    }
  },
  selectedFaultList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      borderBottomWidth: 0,
    },
  },
  selectedFault: {
    padding: theme.spacing(2),
    '& > p': {
      marginLeft: 20
    },
  },
  studentContainer: {
    flexWrap: 'wrap !important' as 'wrap',
    // marginTop: theme.spacing(1)
  },
  studentChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  studentSection: {
    marginTop: theme.spacing(1)
  },
  studentSelector: {
    width: 300,
  },
  addStudentDoneIcon: {
    color: theme.palette.success.main
  },
  gradeTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

interface IAssignClass {
  classId: string;
  userId?: string;
  assigned: boolean;
}

const DCPReportScheduleAssignment = () => {

  const classes = useStyles();
  const history = useHistory();

  const [userData, setUserData] = React.useState<Identity.UserForTaskAssignmentDto[]>([]);
  const [classData, setClassData] = React.useState<Class.ClassForSimpleListDto[]>([]);
  const [assignClasses, setAssignClasses] = React.useState<IAssignClass[]>([]);
  const [selectedClass, setSelectedClass] = React.useState<Class.ClassForSimpleListDto | null>(null);

  // user option that is currently selected to be add to list
  const [selectedUserOption, setSelectedUserOption] = React.useState<Identity.UserForTaskAssignmentDto | null>(null);

  // user id (user profile id) that is currently selected for assign
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

  const [usersListIds, setUsersListIds] = React.useState<string[]>([]);

  const [date, setDate] = React.useState(new Date());

  const [dateRange, setDateRange] = React.useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({
    startTime: getPreviousMonday(addDays(new Date(), 7)),
    endTime: addDays(getPreviousMonday(addDays(new Date(), 7)), 7*4 - 2)
  })

  React.useEffect(() => {
    
    document.title = '2Cool | Phân công lịch trực cờ đỏ';
    
    initData();

  }, []);

  const initData = async () => {
    const promises: [
      Promise<Util.PagingModel<Identity.UserForTaskAssignmentDto>>,
      Promise<Util.PagingModel<Class.ClassForSimpleListDto>>,
      Promise<Util.PagingModel<TaskAssignment.TaskAssignmentForUpdateDto>>
    ] = [
      IdentityService.getUsersForTaskAssignment(),
      ClassesService.getClassForSimpleList(),
      TaskAssignmentService.getForUpdate({taskType: taskType.DcpReport})
    ];

    const [userRes, classRes, taskAssignRes] = await Promise.all(promises);
    setUserData(userRes.items);
    setClassData(classRes.items);

    const assigns: IAssignClass[] = [];
    const assignedUsersIds: string[] = [];
    classRes.items.forEach(el => {
      const status = taskAssignRes.items.find(x => x.classAssignedId === el.id);
      assigns.push({
        classId: el.id,
        assigned: status ? true : false,
        userId: status && status.assigneeId
      });
    });
    assigns.forEach(el => {
      if (el.assigned && el.userId && !assignedUsersIds.includes(el.userId)) {
        assignedUsersIds.push(el.userId);
      }
    });
    if (taskAssignRes.items.length > 0) {
      const firstItem = taskAssignRes.items[0];
      setDateRange({
        startTime: firstItem.startTime,
        endTime: firstItem.endTime
      });
    }

    setUsersListIds(assignedUsersIds);
    setAssignClasses(assigns);
  };

  const handleSubmit = () => {
    // no unassigned class
    if (assignClasses.findIndex(x => x.assigned === false || !x.userId) !== -1) {
      return toast.info('Vui lòng phân lịch đầy đủ các lớp trước khi lưu!', {
        autoClose: 5000
      });
    }

    // no unassigned selected students
    for (const item of usersListIds) {
      if (assignClasses.findIndex(x => x.userId === item) === -1)  {
        return toast.info('Vui lòng phân lịch đầy đủ cho các học sinh trước khi lưu!', {
          autoClose: 5000
        });
      }
    }

    // valid date range
    if (!dateRange.startTime || !dateRange.endTime) {
      return toast.info('Vui lòng chọn thời gian phân công hợp lệ!', {
        autoClose: 5000
      });
    }

    if (new Date(dateRange.endTime).getTime() - new Date(dateRange.startTime).getTime() <= 0) {
      return toast.info('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!', {
        autoClose: 5000
      });
    }

    if (new Date(dateRange.endTime).getTime() - addDays(dateRange.startTime, 7).getTime() <= 0) {
      return toast.info('Thời gian phân công ít nhất phải từ 1 tuần trở lên!', {
        autoClose: 5000
      });
    }

    // oke
    ActionModal.show({
      title: 'Xác nhận cập nhật lịch trực cờ đỏ?',
      onAccept: async () => {
        try {
          const body: TaskAssignment.CreateUpdateTaskAssignmentDto = {
            items: [],
            taskType: taskType.DcpReport
          };

          body.items = assignClasses.map(x => ({
            assigneeId: x.userId as string,
            classId: x.classId,
            startTime: dateRange.startTime as Date,
            endTime: dateRange.endTime as Date
          }));

          await TaskAssignmentService.createUpdate(body);
          
          toast.success('Phân công lịch trực cờ đỏ thành công!');

          history.goBack();
        } catch (err) {
          console.log(err);
          toast.error('Đã có lỗi xảy ra! Không thể lưu phân công!');
        }
      }
    });
  }

  const getClass = (id: string) => {
    return classData.find(el => el.id === id);
  };
  const getUser = (id: string) => {
    return userData.find(el => el.userProfileId === id);
  };
  const getToolTip = (userId?: string) => {
    if (selectedUserId === null) {
      return 'Chọn cờ đỏ để phân công lớp trực';
    }
    if (userId) {
      const user = getUser(userId);
      return `Đã phân công cho ${user!.name} - ${user!.class.name}`
    }
    return 'Nhấn chọn để phân công';
  };
  const handleCheckChange = (checked: boolean, classId: string) => {
    const assigns = [...assignClasses];
    const assign = assigns.find(x => x.classId === classId);
    if (assign) {
      if (checked && !assign.userId && selectedUserId) {
        assign.userId = selectedUserId;
        assign.assigned = true
      } else if (!checked && assign.userId && selectedUserId) {
        assign.userId = undefined;
        assign.assigned = false;
      }
      setAssignClasses(assigns);
    }
  };
  const getCheckedState = (classId: string) => {
    const assign = assignClasses.find(x => x.classId === classId);
    return assign && assign.assigned;
  };
  const addUserToList = () => {
    if (selectedUserOption !== null && !usersListIds.includes(selectedUserOption.userProfileId)) {
      const users = [...usersListIds];
      users.push(selectedUserOption.userProfileId);
      setUsersListIds(users);
    }
  };
  const removeUserFromList = (userId: string) => {
    const users = [...usersListIds];
    const index = users.findIndex(x => x === userId);
    if (index !== -1) {
      users.splice(index, 1);
      if (userId === selectedUserId || users.length === 0) {
        setSelectedUserId(null);
      }
      setUsersListIds(users);

      // clean assigned class 
      const assigns = assignClasses.map(el => {
        if (el.assigned === false || (el.assigned && el.userId !== userId)) {
          return el;
        } else {
          return {
            classId: el.classId,
            assigned: false,
          };
        }
      });
      setAssignClasses(assigns);
    }
  };
  const getUserInfo = (userId: string) => {
    const user = userData.find(x => x.userProfileId === userId);
    return `${user?.class.name} - ${user?.name}`;
  };

  const handleSelectUser = (e: React.MouseEvent, id: string) => {
    if (e && e.nativeEvent 
      && (e.nativeEvent.target && e.nativeEvent.target as any).nodeName === 'svg') {
      e.stopPropagation();
    } else  {
      setSelectedUserId(id);
    }
  };

  const getDisabled = (assignedUserId?: string) => {
    return selectedUserId === null || (!!assignedUserId && selectedUserId !== assignedUserId);
  };

  React.useEffect(() => {
    console.log({selectedUserId});
  }, [selectedUserId]);

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'report-schedule-assignment'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' style={{paddingTop: 12, paddingBottom: 12}}>
                <Grid item container direction={'row'} alignItems={'center'}>
                  <AlarmIcon style={{ marginRight: 8 }}/>
                  <Typography variant={'body2'}>{`${getDayOfWeek(date.toLocaleString())} - ${formatTime(date.toLocaleString())}`}</Typography>
                </Grid>
              </Grid>

              <Grid item container alignItems='flex-end' justify='flex-end'>
                <Button 
                  variant={'contained'} 
                  color={'primary'}
                  onClick={handleSubmit}
                  startIcon={<AssignmentTurnedInIcon/>}
                >
                  Lưu lịch trực
                </Button>
              </Grid>
            </Grid>              
            <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              <Grid item container direction='row' alignItems='center' className={classes.filter}>
                <Autocomplete
                  id='task-start-date-selector'
                  className={classes.classesSelector}
                  options={classData}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  value={selectedClass}
                  onChange={(e, newValue) => setSelectedClass(newValue)}
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Chọn lớp' placeholder='Nhập tên lớp' />
                  )}
                />
                <Autocomplete
                  id='task-end-date-selector'
                  className={classes.studentsSelector}
                  options={
                    userData.filter(x => selectedClass ? selectedClass.name === x.class.name : true)
                  }
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  groupBy={(option) => option.class.name}
                  value={selectedUserOption}
                  onChange={(e, newValue) => setSelectedUserOption(newValue)}
                  size='small'
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Chọn cờ đỏ' placeholder='Nhập tên lớp' />
                  )}
                />
                <Tooltip title='Thêm cờ đỏ vào danh sách chọn'>
                  <IconButton 
                    aria-label='add' 
                    style={{marginRight: 'auto'}}
                    disabled={selectedUserOption === null}
                    onClick={addUserToList}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box>
                    <KeyboardDateTimePicker
                      style={{width: 150, marginLeft: 32, marginRight: 32}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-rankings-report-start'
                      label='Lịch trực từ'
                      value={dateRange.startTime}
                      onChange={date => setDateRange(prev => ({...prev, startTime: date || prev.startTime}))}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - change start date',
                      }}
                    />
                  </Box>
                  <ArrowRightAltIcon />
                  <Box>
                    <KeyboardDatePicker
                      style={{width: 150, marginLeft: 32}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-rankings-report-end'
                      label='Đến ngày'
                      value={dateRange.endTime}
                      onChange={date => setDateRange(prev => ({...prev, endTime: date || prev.endTime}))}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - change end date',
                      }}
                    />
                  </Box>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item container style={{flex: 1, minHeight: 0, flexWrap: 'nowrap'}} >
                <Grid item container style={{ backgroundColor: 'red', width: 600, minHeight: 0, overflowY: 'auto' }}>
                  <Paper elevation={3} style={{width: '100%', minHeight: 0, overflowY: 'auto', height: '100%'}}>
                    <List className={classes.selectedClassList}>
                      {
                        usersListIds.map((el, i) => (
                        <ListItem 
                          key={el} 
                          className={el === selectedUserId ? classes.activeSelectedItem : ''}
                          style={{paddingRight: 8}}
                        >
                          <Grid 
                            container 
                            direction='row' 
                            alignItems='center' 
                            className={classes.selectedItem}
                            onClick={(e) => handleSelectUser(e, el)}
                          >
                            <Grid item container alignItems='center' direction='row'>
                              <FaceIcon style={{marginLeft: 16, marginRight: 8}} />
                              <p>{getUserInfo(el)}</p>
                            </Grid>
                            <Tooltip title='Xóa cờ đỏ ra khỏi danh sách'>
                              <IconButton 
                                aria-label='remove-item' 
                                className={classes.removeItemBtn}
                                onClick={() => removeUserFromList(el)} 
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </ListItem>))
                      }
                    </List>
                    {
                      usersListIds.length === 0 && (
                        <Grid container justify='center' alignItems='center' className={classes.emptySelectedList} >
                          <p>Vui lòng thêm cờ đỏ để phân công</p>
                        </Grid>
                      )
                    }
                  </Paper>
                </Grid>
                <Grid item container direction='column' style={{ flexWrap: 'nowrap', minHeight: 0, overflowY: 'auto', marginLeft: 32 }}>
                  <Paper elevation={3} style={{overflowY: 'auto', minHeight: 0, height: '100%', padding: 16, paddingRight: 16 }}>
                    <p className={classes.gradeTitle} >Khối 10</p>
                    {
                      assignClasses.filter(x => getClass(x.classId)?.name.startsWith('Lớp 10'))
                        .map((el,i) => (
                        <Tooltip key={i} title={getToolTip(el.userId)} >
                          <FormControlLabel
                            style={{width: 150}}
                            disabled={getDisabled(el.userId)}
                            control={
                              <Checkbox
                                checked={getCheckedState(el.classId)}
                                onChange={(e) => handleCheckChange(e.target.checked, el.classId)}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label={getClass(el.classId)?.name || ''}
                          />
                        </Tooltip>
                      ))
                    }
                    <p className={classes.gradeTitle} style={{marginTop: 16}} >Khối 11</p>
                    {
                      assignClasses.filter(x => getClass(x.classId)?.name.startsWith('Lớp 11'))
                        .map((el,i) => (
                        <Tooltip key={i} title={getToolTip(el.userId)} >
                          <FormControlLabel
                            style={{width: 150}}
                            disabled={getDisabled(el.userId)}
                            control={
                              <Checkbox
                                checked={getCheckedState(el.classId)}
                                onChange={(e) => handleCheckChange(e.target.checked, el.classId)}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label={getClass(el.classId)?.name || ''}
                          />
                        </Tooltip>
                      ))
                    }
                    <p className={classes.gradeTitle} style={{marginTop: 16}} >Khối 12</p>
                    {
                      assignClasses.filter(x => getClass(x.classId)?.name.startsWith('Lớp 12'))
                        .map((el,i) => (
                        <Tooltip key={i} title={getToolTip(el.userId)} >
                          <FormControlLabel
                            style={{width: 150}}
                            disabled={getDisabled(el.userId)}
                            control={
                              <Checkbox
                                checked={getCheckedState(el.classId)}
                                onChange={(e) => handleCheckChange(e.target.checked, el.classId)}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label={getClass(el.classId)?.name || ''}
                          />
                        </Tooltip>
                      ))
                    }
                    </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DCPReportScheduleAssignment;