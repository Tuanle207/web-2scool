/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Button, makeStyles, Typography, Paper } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import { Class, TaskAssignment, Account } from '../interfaces';
import { DataGrid, GridCellParams, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { TaskAssignmentService } from '../api';
import { getDayOfWeek, formatTime, formatDate } from '../utils/TimeHelper';
import { dataGridLocale, taskType } from '../appConsts';
import AlarmIcon from '@material-ui/icons/Alarm';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { routes } from '../routers/routesDictionary';
import { sleep } from '../utils/SetTimeOut';
import usePageTitleBarStyles from '../assets/jss/components/PageTitleBar/usePageTitleBarStyles';
import ContactCard from '../components/ContactCard';

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
    width: 200,
    renderCell: (params: GridCellParams) => {
      const account = params.value as Account.SimpleAccountDto;
      const value = account?.name;
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ContactCard contact={account}/>
          <span style={{ marginLeft: 8, cursor: 'default' }}>{value}</span>
        </div>
      )
    }
  },
  {
    field: 'belongsToClass',
    headerName: 'Thuộc lớp ',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.getValue('assignee') as Account.SimpleAccountDto;
      return value.classDisplayName;
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

  const [data, setData] = useState<TaskAssignment.TaskAssignmentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updatedTime, setUpdatedTime] = useState<Date>();
  const [creatorInfo, setCreatorInfo] = useState<Account.SimpleAccountDto>();

  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    
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
        setUpdatedTime(firstItem.creationTime);
        setCreatorInfo(firstItem.creator);
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

  const timeText = 'Cập nhật lần cuối vào ' + (updatedTime ? `${getDayOfWeek(updatedTime.toLocaleString())} - ${formatTime(updatedTime.toLocaleString())}` : 'Không xác định');
  const creatorText = creatorInfo ? `Phân công bởi ${creatorInfo.name}` : 'Chưa được ai phân công';


  return (
    <Grid style={{ height: '100%' }} item container direction={'column'}>
      <Grid item >
        <Header
          pageName="Phân công trực cờ đỏ"
          searchBarPlaceholder="Tìm kiếm lớp..."
          onTextChange={(text) => setClassFilter(text)}
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
            <Grid item container alignItems="center" justify="space-between" className={titleBarStyles.container}>
              <Grid item container direction="row" alignItems="center" justify="center" >
                <AlarmIcon style={{ marginRight: 8 }}/>
                <Typography variant="body2">{timeText}</Typography>
              </Grid>
              <Grid item container direction="row" alignItems="center" justify="center">
                <PermContactCalendarIcon style={{ marginRight: 8 }}/>
                <Typography variant="body2">{creatorText}</Typography>
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
              rows={data.filter(x => x.classAssigned.name.includes(classFilter))}
              loading={loading}
              error={error}
              paginationMode='server'
              hideFooter
              hideFooterPagination
              localeText={dataGridLocale}
            />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DCPReportSchedule;