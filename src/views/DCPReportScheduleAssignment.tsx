/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, List, ListItem, Typography, IconButton, 
  Tooltip, TextField, Paper, FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import { TaskAssignment, Class, Util, Account, Grade } from '../interfaces';
import { TaskAssignmentService, AccountsService, ClassesService } from '../api';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FaceIcon from '@material-ui/icons/Face';
import AlarmIcon from '@material-ui/icons/Alarm';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { taskType } from '../appConsts';
import { getDayOfWeek, formatTime, getLatestMonday } from '../utils/TimeHelper';
import useStyles from '../assets/jss/views/DCPReportScheduleAssignment';  
import moment from 'moment';
import { busyService, dialogService } from '../services';
import { unstable_batchedUpdates } from 'react-dom';

interface IAssignClass {
  classId: string;
  accountId?: string;
  assigned: boolean;
}

const DCPReportScheduleAssignment = () => {

  const classes = useStyles();
  const history = useHistory();

  const [accountData, setAccountData] = useState<Account.SimpleAccountDto[]>([]);
  const [classData, setClassData] = useState<Class.ClassForSimpleListDto[]>([]);
  const [assignClasses, setAssignClasses] = useState<IAssignClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class.ClassForSimpleListDto | null>(null);
  const [grades, setGrades] = useState<Grade.GradeForSimpleListDto[]>([]);

  // account option that is currently selected to be add to list
  const [selectedAccountOption, setSelectedAccountOption] = useState<Account.SimpleAccountDto | null>(null);

  // account id  that is currently selected for assign
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [assigneeAccountListIds, setAssigneeAccountListIds] = useState<string[]>([]);

  const [date] = useState(new Date());

  const [dateRange, setDateRange] = useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({
    startTime: getLatestMonday(),
    endTime: moment(getLatestMonday()).add(3, 'months').toDate()
  })

  useEffect(() => {
    document.title = '2Scool | Phân công lịch trực cờ đỏ';
    initData();
  }, []);

  const initData = async () => {
    const promises: [
      Promise<Util.PagingModel<Account.SimpleAccountDto>>,
      Promise<Util.PagingModel<Class.ClassForSimpleListDto>>,
      Promise<Util.PagingModel<TaskAssignment.TaskAssignmentForUpdateDto>>
    ] = [
      AccountsService.getTaskAssignmentAccounts(),
      ClassesService.getClassForSimpleList(),
      TaskAssignmentService.getForUpdate({taskType: taskType.DcpReport})
    ];

    const [accountRes, classRes, taskAssignRes] = await Promise.all(promises);
    

    const assigns: IAssignClass[] = [];
    const assignedAccountIds: string[] = [];
    classRes.items.forEach((el) => {
      const status = taskAssignRes.items.find(x => x.classAssignedId === el.id);
      assigns.push({
        classId: el.id,
        assigned: status ? true : false,
        accountId: status?.assigneeId
      });
    });
    assigns.forEach(el => {
      if (el.assigned && el.accountId && !assignedAccountIds.includes(el.accountId)) {
        assignedAccountIds.push(el.accountId);
      }
    });
    
    const grades = classRes.items.map(x => x.grade);
    const gradeIds = grades.map(x => x.id);
    const distinctGradeIds = [...new Set(gradeIds)];
    const distinctGrades = distinctGradeIds.map(x => grades.find(c => c.id === x)!);
    
    unstable_batchedUpdates(() =>  {
      setAccountData(accountRes.items);
      setClassData(classRes.items);
      setAssigneeAccountListIds(assignedAccountIds);
      setAssignClasses(assigns);
      setGrades(distinctGrades);
    })
  };

  const handleSubmit = async () => {
    // no unassigned class
    if (assignClasses.findIndex(x => x.assigned === false || !x.accountId) !== -1) {
      return toast.error('Vui lòng phân lịch đầy đủ các lớp trước khi lưu!', {
        autoClose: 5000
      });
    }

    // no unassigned selected students
    for (const item of assigneeAccountListIds) {
      if (assignClasses.findIndex(x => x.accountId === item) === -1)  {
        return toast.error('Vui lòng phân lịch đầy đủ cho các học sinh trước khi lưu!', {
          autoClose: 5000
        });
      }
    }

    // valid date range
    if (!dateRange.startTime || !dateRange.endTime) {
      return toast.error('Vui lòng chọn thời gian phân công hợp lệ!', {
        autoClose: 5000
      });
    }

    if (moment(dateRange.startTime).isSameOrAfter(moment(dateRange.endTime))) {
      return toast.error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!', {
        autoClose: 5000
      });
    }

    if (moment(dateRange.startTime).isSameOrAfter(moment(dateRange.endTime).add(7, 'days'))) {
      return toast.error('Thời gian phân công ít nhất phải từ 1 tuần trở lên!', {
        autoClose: 5000
      });
    }

    const { result } = await dialogService.show(null, {
      type: 'default',
      title: 'Xác nhận',
      message: 'Xác nhận cập nhật lịch trực cờ đỏ?'
    });

    if (result === 'Ok') {
      try {
        busyService.busy(true);
        const body: TaskAssignment.CreateUpdateTaskAssignmentDto = {
          items: [],
          taskType: taskType.DcpReport
        };

        body.items = assignClasses.map(x => ({
          assigneeId: x.accountId as string,
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
      } finally {
        busyService.busy(false);
      }
    }
  }

  const getClass = (id: string) => {
    return classData.find(el => el.id === id);
  };
  const getUser = (id: string) => {
    return accountData.find(el => el.id === id);
  };
  const getToolTip = (accountId?: string) => {
    if (selectedAccountId === null) {
      return 'Chọn cờ đỏ để phân công lớp trực';
    }
    if (accountId) {
      const account = getUser(accountId);
      return `Đã phân công cho ${account?.name} - ${account?.class?.name}`
    }
    return 'Nhấn chọn để phân công';
  };
  const handleCheckChange = (checked: boolean, classId: string) => {
    const assigns = [...assignClasses];
    const assign = assigns.find(x => x.classId === classId);
    if (assign) {
      if (checked && !assign.accountId && selectedAccountId) {
        assign.accountId = selectedAccountId;
        assign.assigned = true
      } else if (!checked && assign.accountId && selectedAccountId) {
        assign.accountId = undefined;
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
    if (selectedAccountOption !== null && !assigneeAccountListIds.includes(selectedAccountOption.id)) {
      const users = [...assigneeAccountListIds];
      users.push(selectedAccountOption.id);
      setAssigneeAccountListIds(users);
    }
  };
  const removeUserFromList = (userId: string) => {
    const users = [...assigneeAccountListIds];
    const index = users.findIndex(x => x === userId);
    if (index !== -1) {
      users.splice(index, 1);
      if (userId === selectedAccountId || users.length === 0) {
        setSelectedAccountId(null);
      }
      setAssigneeAccountListIds(users);

      // clean assigned class 
      const assigns = assignClasses.map(el => {
        if (el.assigned === false || (el.assigned && el.accountId !== userId)) {
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
  const getAccountInfo = (accountId: string) => {
    const account = accountData.find(x => x.id === accountId);
    return `${account?.class?.name} - ${account?.name}`;
  };

  const handleSelectUser = (e: React.MouseEvent, id: string) => {
    if (e && e.nativeEvent 
      && (e.nativeEvent.target && e.nativeEvent.target as any).nodeName === 'svg') {
      e.stopPropagation();
    } else  {
      setSelectedAccountId(id);
    }
  };


  //???WHAT IS THIS const getDisabled = (assignedUserId?: string) => {
  //   return selectedAccountId === null || (!!assignedUserId && selectedAccountId !== assignedUserId);
  // };

  const renderGradeBlock = (grade: Grade.GradeForSimpleListDto) => {
    return (
      <div>
        <p className={classes.gradeTitle}>{grade.displayName}</p>
        {
          assignClasses.filter(x => getClass(x.classId)?.grade.id === grade.id)
            .map((el,i) => (
            <Tooltip key={i} title={getToolTip(el.accountId)} >
              {/* disabled={getDisabled(el.accountId)} */}
              <FormControlLabel
                style={{width: 150}}
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
      </div>
    )
  }

  return (
    <Grid style={{ height: '100%' }} item container direction={'column'}>
      <Header pageName="Phân công lịch trực cờ đỏ" />
      <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
        <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
          <Grid item container direction='row' alignItems='center' style={{paddingTop: 12, paddingBottom: 12, width: 'auto'}}>
            <Grid item container direction={'row'} alignItems={'center'}>
              <AlarmIcon style={{ marginRight: 8 }}/>
              <Typography variant={'body2'}>{`${getDayOfWeek(date.toLocaleString())} - ${formatTime(date.toLocaleString())}`}</Typography>
            </Grid>
          </Grid>

          <Grid item container alignItems='flex-end' justify='flex-end' style={{ width: 'auto' }}>
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
                accountData.filter(x => selectedClass ? selectedClass.name === x.class.name : true)
              }
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.id === value.id}
              groupBy={(option) => option.class.name}
              value={selectedAccountOption}
              onChange={(e, newValue) => setSelectedAccountOption(newValue)}
              size='small'
              renderInput={(params) => (
                <TextField {...params} variant='outlined' label='Chọn cờ đỏ' placeholder='Nhập tên lớp' />
              )}
            />
            <Tooltip title='Thêm cờ đỏ vào danh sách chọn'>
              <IconButton 
                aria-label='add' 
                style={{marginRight: 'auto'}}
                onClick={addUserToList}
                >
                {/* disabled={selectedAccountOption === null} */}
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
                    assigneeAccountListIds.map((el, i) => (
                    <ListItem 
                      key={el} 
                      className={el === selectedAccountId ? classes.activeSelectedItem : ''}
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
                          <p>{getAccountInfo(el)}</p>
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
                  assigneeAccountListIds.length === 0 && (
                    <Grid container justify='center' alignItems='center' className={classes.emptySelectedList} >
                      <p>Vui lòng thêm cờ đỏ để phân công</p>
                    </Grid>
                  )
                }
              </Paper>
            </Grid>
            <Grid item container direction='column' style={{ flexWrap: 'nowrap', minHeight: 0, overflowY: 'auto', marginLeft: 32 }}>
              <Paper elevation={3} style={{overflowY: 'auto', minHeight: 0, height: '100%', padding: 16, paddingRight: 16 }}>
                {
                  grades.map((grade, index) => renderGradeBlock(grade))
                }
                {/* <p className={classes.gradeTitle} >Khối 10</p>
                TODO: fix
                {
                  assignClasses.filter(x => getClass(x.classId)?.grade.displayName === 'Lớp 10')
                    .map((el,i) => (
                    <Tooltip key={i} title={getToolTip(el.accountId)} >
                      <FormControlLabel
                        style={{width: 150}}
                        disabled={getDisabled(el.accountId)}
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
                  assignClasses.filter(x => getClass(x.classId)?.grade.displayName === 'Lớp 11')
                    .map((el,i) => (
                    <Tooltip key={i} title={getToolTip(el.accountId)} >
                      <FormControlLabel
                        style={{width: 150}}
                        disabled={getDisabled(el.accountId)}
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
                  assignClasses.filter(x => getClass(x.classId)?.grade.displayName === 'Lớp 12')
                    .map((el,i) => (
                    <Tooltip key={i} title={getToolTip(el.accountId)} >
                      <FormControlLabel
                        style={{width: 150}}
                        disabled={getDisabled(el.accountId)}
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
                } */}
                </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DCPReportScheduleAssignment;