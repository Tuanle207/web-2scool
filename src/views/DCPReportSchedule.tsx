/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Button, makeStyles, Typography, Paper, Box } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, TaskAssignment, Util } from '../interfaces';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { TaskAssignmentService } from '../api';
import { getDayOfWeek, formatTime, formatDate } from '../utils/TimeHelper';
import { taskType } from '../appConsts';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { routes } from '../routers/routesDictionary';
import { sleep } from '../utils/SetTimeOut';
import usePageTitleBarStyles from '../assets/jss/components/PageTitleBar/usePageTitleBarStyles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%', 
    width: '100%',
    '& .MuiDataGrid-root': {
      backgroundColor: '#fff',
      padding: theme.spacing(0, 2),
    },
    '& .MuiDataGrid-root *': {
      '&::-webkit-scrollbar': {
        width: 8,
        height: 8
      }
    },
    '& .MuiDataGrid-iconSeparator': {
      color: theme.palette.divider,
      
      '&:hover': {
        color: theme.palette.common.black
      }
    },
    '& .MuiDataGrid-colCell': {
      // borderRight: '1px solid #303030',
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    }
  },
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    }
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
  const titleBarStyles = usePageTitleBarStyles();
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
    } catch (error: any) {
      if (error?.message) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const onMainButtonClick = () => {
    history.push(routes.DCPReportScheduleAssignment);
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.DCPReportSchedule} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          {/* <Header pageName="Phân công trực cờ đỏ" /> */}
          <Grid item >
            <Header
              pageName="Phân công trực cờ đỏ"
            />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item style={{ 
              backgroundColor: "#e8e8e8", 
              paddingTop: 16, 
              paddingRight: 24, 
              paddingLeft: 24 
            }}
            >
              <Paper variant="outlined" elevation={1}>
                <Grid item container alignItems="center" className={titleBarStyles.container}>
                  <Grid item container direction="row" alignItems="center">
                    <AlarmIcon style={{ marginRight: 8 }}/>
                    <Typography variant="body2">{`Cập nhật lần cuối vào ${getDayOfWeek(updatedTime.toLocaleString())} - ${formatTime(updatedTime.toLocaleString())}`}</Typography>
                  </Grid>
                  <Grid item container direction="row" alignItems="center" justify="center">
                    <PermContactCalendarIcon style={{ marginRight: 8 }}/>
                    <Typography variant="body2">{`Phân công bởi Lê Anh Tuấn`}</Typography>
                  </Grid>
                  <Grid item container justify="flex-end">
                    <Button variant="contained"
                      color={'primary'}
                      onClick={onMainButtonClick}
                    >
                      Cập nhật
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8' }}>
              <Container className={classes.root}>
                <DataGrid
                  columns={cols}
                  rows={data}
                  loading={loading}
                  error={error}
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