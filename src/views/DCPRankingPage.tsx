/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Container, Grid, Box, IconButton, Chip, Tooltip, Paper,
  Badge } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Stats } from '../interfaces';
import { DataGrid, GridColDef, GridRowParams } from '@material-ui/data-grid';
import { StatisticsService } from '../api';
import { getPreviousMonday } from '../utils/TimeHelper';
import { FindInPage } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
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
    width: 120
  },
  {
    field: 'totalAbsence',
    headerName: 'Lượt vắng',
    width: 120
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
    headerName: 'Điểm trừ',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'lrPoints',
    headerName: 'Điểm sổ đầu bài',
    width: 120
  },
  {
    field: 'dcpPoints',
    headerName: 'Điểm nề nếp',
    width: 120
  },
  {
    field: 'rankingPoints',
    headerName: 'Điểm thi đua',
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

  const [dateFilter, setDateFilter] = useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({startTime: getPreviousMonday(new Date()), endTime: new Date()})

  const [data, setData] = useState<Stats.OverallClassRanking[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [viewType, setViewType] = useState<ViewType>('ByWeek');

  useEffect(() => {
    document.title = '2Cool | Xếp hạng thi đua nề nếp';
  }, []);

  useEffect(() => {
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
    setLoading(true);

    try {

      const res = await StatisticsService.getOverallRanking({
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
    StatisticsService.getOverallRankingExcel({
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
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction="column" >
          <Grid item >
            <Header
              pageName="Xếp hạng thi đua nề nếp"
            />
          </Grid>

          <Grid item container direction="column" style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
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
                  <Tooltip title="Bộ lọc" style={{ marginRight: 16 }}>
                      <Badge color="primary" >
                        <FilterIcon fontSize="small" />
                      </Badge>
                  </Tooltip>
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
                        placeholder="Bắt đầu từ"
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
                        placeholder="Đến ngày"
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
              </Paper>
            </Grid>              
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8'}}>
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