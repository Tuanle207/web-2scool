/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, IconButton, Chip, Tooltip } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Stats } from '../interfaces';
import { DataGrid, GridColDef, GridRowParams } from '@material-ui/data-grid';
import { StatisticsService } from '../api';
import { getPreviousMonday } from '../utils/TimeHelper';
import { FindInPage } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import { sleep } from '../utils/SetTimeOut';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/DCPRankingPage';


const cols: GridColDef[] = [
  {
    field: 'classId',
    headerName: 'Mã lớp',
    hide: true
  },
  {
    field: 'ranking',
    headerName: 'Thứ hạng',
    width: 120,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'className',
    headerName: 'Lớp',
    width: 120,
  },
  {
    field: 'formTeacherName',
    headerName: 'Giáo viên chủ nhiệm',
    flex: 1
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'penaltyPoints',
    headerName: 'Tổng điểm trừ',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'totalPoints',
    headerName: 'Tổng điểm',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: '',
    headerName: 'Chi tiết',
    // disableClickEventBubbling: true,
    hideSortIcons: true,
    align: 'center',
    renderCell: (params) => {
      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary'>
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

type ViewType = 'ByWeek' | 'ByMonth' | 'BySemester';

const DCPRankingPage = () => {

  const classes = useStyles();

  const [dateFilter, setDateFilter] = React.useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({startTime: getPreviousMonday(new Date()), endTime: new Date()})

  const [data, setData] = React.useState<Stats.DcpClassRanking[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  const [viewType, setViewType] = React.useState<ViewType>('ByWeek');

  React.useEffect(() => {
    document.title = '2Cool | Xếp hạng thi đua nề nếp';
  }, []);

  React.useEffect(() => {
    if (dateFilter && dateFilter.startTime && dateFilter.endTime)  {
      fetchData();
    }
  }, [dateFilter]);

  const handleWeekFilter = () => {
    const startTime = getPreviousMonday(new Date());
    const endTime = new Date();
    setDateFilter({
      startTime,
      endTime
    });
  };

  const handleMonthFilter = () => {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), 1);
    const endTime = now;
    setDateFilter({
      startTime,
      endTime
    });
  };

  const handleSemesterFilter = () => {
    const now = new Date();
    if (now.getMonth() < 1) {
      // TODO: GET START TIME BY GETTING COURSE INFOMATION, STORE SEMESTER INFORMATION
      const startTime = new Date(now.getFullYear() - 1, 8, 5);
      const endTime = now;
      setDateFilter({
        startTime,
        endTime
      });
    } else {
      const startTime = new Date(now.getFullYear(), 1, 1);
      const endTime = now;
      setDateFilter({
        startTime,
        endTime
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await sleep(200);

      const res = await StatisticsService.getDcpRanking({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });

      setData(res.items);  
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = () => {
    StatisticsService.getDcpRankingExcel({
      startTime: dateFilter.startTime!,
      endTime: dateFilter.endTime!
    });
  };


  const getRowClass = (param: GridRowParams): string => {
    const ranking = param.getValue('ranking') as number;
    if (ranking === 1) {
      return classes.top1Item;
    } else if (ranking === 2){
      return classes.top2Item;
    } else if  (ranking === 3){
      return classes.top3Item;
    }
    return "";
  };

  const handleViewTypeChange = (mode: ViewType) => {
    if (mode !== viewType) {
      setViewType(mode);

      switch (mode) {
        case 'ByWeek': 
          handleWeekFilter();
          break;
        case 'ByMonth': 
          handleMonthFilter();
          break;
        case 'BySemester': 
          handleSemesterFilter();
          break;
        default: 
          handleWeekFilter();
      }
    }
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.DCPRanking} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' >
                <Chip
                  clickable label='Xếp hạng tuần' 
                  onClick={() => handleViewTypeChange('ByWeek')}
                  variant={viewType === 'ByWeek' ? 'default' : 'outlined'} 
                  color={viewType === 'ByWeek' ? 'primary' : 'default'} style={{marginLeft: 16}}
                  />
                <Chip clickable label='Xếp hạng tháng' 
                  onClick={() => handleViewTypeChange('ByMonth')}
                  variant={viewType === 'ByMonth' ? 'default' : 'outlined'} 
                  color={viewType === 'ByMonth' ? 'primary' : 'default'}
                  style={{marginLeft: 8}}
                />
                <Chip clickable label='Xếp hạng học kỳ' 
                  onClick={() => handleViewTypeChange('BySemester')}
                  variant={viewType === 'BySemester' ? 'default' : 'outlined'} 
                  color={viewType === 'BySemester' ? 'primary' : 'default'}
                  style={{marginLeft: 8, marginRight: 16}}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box>
                    <KeyboardDatePicker
                      style={{width: 150}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-rankings-report-start'
                      label='Bắt đầu từ'
                      value={dateFilter.startTime}
                      onChange={() => {}}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - change start date',
                      }}
                    />
                  </Box>
                  <Box>
                    <KeyboardDatePicker
                      style={{width: 150}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-rankings-report-end'
                      label='Đến ngày'
                      value={dateFilter.endTime}
                      onChange={() => {}}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - change end date',
                      }}
                    />
                  </Box>
                </MuiPickersUtilsProvider>

                <Tooltip title='Tải báo cáo' style={{marginLeft: 'auto'}}>
                  <IconButton color='primary' aria-label='Tải báo cáo' onClick={handleDownloadFile}>
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
      
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              <Container className={classes.datagridContainer}>
                <DataGrid
                  columns={cols}
                  rows={data}
                  paginationMode='server'
                  hideFooterPagination
                  loading={loading}
                  hideFooter
                  getRowId={data => data.classId}
                  getRowClassName={getRowClass}
                />
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DCPRankingPage;