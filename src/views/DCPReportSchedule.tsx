/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Button, makeStyles, List, ListItem, Typography, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, TaskAssignment, Util } from '../common/interfaces';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { TaskAssignmentService } from '../common/api';
import { getDayOfWeek, formatTime, formatDate } from '../common/utils/TimeHelper';
import { taskType } from '../common/appConsts';
import { FindInPage } from '@material-ui/icons';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

import StudentList from '../components/Modal/StudentList';
import { sleep } from '../common/utils/SetTimeOut';


const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
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
}));


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
    }
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
  }
];


const DCPReportSchedule = () => {

  const classes = useStyles();
  const history = useHistory();

  const [data, setData] = React.useState<TaskAssignment.TaskAssignmentDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [updatedTime, setUpdatedTime] = React.useState(new Date());
  const [creatorInfo, setCreatorInfo] = React.useState<Util.IObject>({});

  React.useEffect(() => {
    
    document.title = '2Cool | Phân công trực cờ đỏ';
    getData();

  }, []);


  const getData = async () => {
    try {
      setLoading(true);
      await sleep(200);
      const res = await TaskAssignmentService.getAll({taskType: taskType.DcpReport});
      setData(res.items);
      if (res.items.length > 0) {
        const firstItem = res.items[0];
        if (firstItem.creationTime) {
          setUpdatedTime(firstItem.creationTime);
        }
        if (firstItem.creator) {
          setCreatorInfo(firstItem.creator);
        }
      }
    } catch (error) {
      if (error?.message) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'report-schedule-assignment'} />
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
                onClick={() => history.push('dcp-report-schedules-assignment')}>
                Phân công lịch trực
              </Button>

              {/* <Grid item container alignItems='flex-end' justify='flex-end'>
                
              </Grid> */}
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              <Container className={classes.datagridContainer}>
                <DataGrid
                  columns={cols}
                  rows={data}
                  loading={loading}
                  // error={error}
                  paginationMode='server'
                  hideFooter
                  hideFooterPagination
                />
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DCPReportSchedule;