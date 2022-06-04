/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from 'react';
import { Container, Grid, Box, IconButton, Chip, Tooltip, Paper,
  Badge, 
  FormControl,
  Select,
  MenuItem} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Header from '../components/Header';
import { Stats } from '../interfaces';
import { DataGrid, GridCellParams, GridColDef } from '@material-ui/data-grid';
import { StatisticsService } from '../api';
import { getPreviousMonday } from '../utils/TimeHelper';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
import useStyles from '../assets/jss/views/DCPRankingPage';
import { dataGridLocale } from '../appConsts';
import { ReactComponent as Top1Icon } from '../assets/img/top-1.svg';
import { ReactComponent as Top2Icon } from '../assets/img/top-2.svg';
import { ReactComponent as Top3Icon } from '../assets/img/top-3.svg';

const overallCols: GridColDef[] = [
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
    headerAlign: 'right',
    renderCell: (params: GridCellParams) => {
      const topIcons = {
        1: Top1Icon,
        2: Top2Icon,
        3: Top3Icon
      } as any;
      const value = params.value;
      if (typeof value === 'number' && [1,2,3].includes(value)) {
        const Icon = topIcons[value];
        return (
          <Grid container justify="center" alignItems="center">
            <Icon />
          </Grid>
        );
      }
      return <div>{value}</div>
    }
  },
  {
    field: 'className',
    headerName: 'Lớp',
    width: 120,
  },
  {
    field: 'formTeacherName',
    headerName: 'Giáo viên chủ nhiệm',
    width: 200
  },
  {
    field: 'totalAbsence',
    headerName: 'Lượt vắng',
    width: 120,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'penaltyPoints',
    headerName: 'Điểm trừ',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'lrPoints',
    headerName: 'Điểm sổ đầu bài',
    width: 180,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'dcpPoints',
    headerName: 'Điểm nề nếp',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'rankingPoints',
    headerName: 'Điểm thi đua',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  }
];

const dcpCols: GridColDef[] = [
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
    headerAlign: 'right',
    renderCell: (params: GridCellParams) => {
      const topIcons = {
        1: Top1Icon,
        2: Top2Icon,
        3: Top3Icon
      } as any;
      const value = params.value;
      if (typeof value === 'number' && [1,2,3].includes(value)) {
        const Icon = topIcons[value];
        return (
          <Grid container justify="center" alignItems="center">
            <Icon />
          </Grid>
        );
      }
      return <div>{value}</div>
    }
  },
  {
    field: 'className',
    headerName: 'Lớp',
    width: 120,
  },
  {
    field: 'formTeacherName',
    headerName: 'Giáo viên chủ nhiệm',
    width: 200
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'penaltyPoints',
    headerName: 'Điểm trừ',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'dcpPoints',
    headerName: 'Điểm nề nếp',
    width: 150,
    align: 'center',
    headerAlign: 'center'
  },
];

const lrCols: GridColDef[] = [
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
    headerAlign: 'right',
    renderCell: (params: GridCellParams) => {
      const topIcons = {
        1: Top1Icon,
        2: Top2Icon,
        3: Top3Icon
      } as any;
      const value = params.value;
      if (typeof value === 'number' && [1,2,3].includes(value)) {
        const Icon = topIcons[value];
        return (
          <Grid container justify="center" alignItems="center">
            <Icon />
          </Grid>
        );
      }
      return <div>{value}</div>
    }
  },
  {
    field: 'className',
    headerName: 'Lớp',
    width: 120,
  },
  {
    field: 'formTeacherName',
    headerName: 'Giáo viên chủ nhiệm',
    width: 200
  },
  {
    field: 'totalAbsence',
    headerName: 'Lượt vắng',
    width: 120,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'lrPoints',
    headerName: 'Điểm sổ đầu bài',
    width: 180,
    align: 'center',
    headerAlign: 'center'
  },
];

interface DateFilter {
  startTime: Date | null,
  endTime: Date | null
}

type ViewType = 'ByWeek' | 'ByMonth' | 'BySemester' | 'Custom';
type RankingType = 'DCP' | 'LR' | 'OVERALL';

const DCPRankingPage = () => {

  const classes = useStyles();

  const [dateFilter, setDateFilter] = useState<DateFilter>({startTime: getPreviousMonday(new Date()), endTime: new Date()})

  const [overalRankings, setOveralRankings] = useState<Stats.OverallClassRanking[]>([]);
  const [dcpRankings, setDcpRankings] = useState<Stats.DcpClassRanking[]>([]);
  const [lrRankings, setLrRankings] = useState<Stats.LrClassRanking[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [classFilter, setClassFilter] = useState<string>('');
  const [rankingType, setRankingType] = useState<RankingType>('OVERALL');
  const [viewType, setViewType] = useState<ViewType>('ByWeek');

  useEffect(() => {
    document.title = '2Scool | Xếp hạng thi đua nề nếp';
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

  const handleRankingTypeChange = (e: ChangeEvent<any>) => {
    const value = e.target.value as RankingType;
    if (value !== rankingType) {
      setRankingType(value);
      setViewType('ByWeek');
      handleWeekFilter();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const fns: {fetchFn: Function; setState: Function;} = {
        fetchFn: StatisticsService.getOverallRanking,
        setState: setOveralRankings,
      };
      switch (rankingType) {
        case 'DCP':
          fns.fetchFn = StatisticsService.getDcpRanking;
          fns.setState = setDcpRankings;
          break;
        case 'LR':
          fns.fetchFn = StatisticsService.getLrRanking;
          fns.setState = setLrRankings;
          break;
        case 'OVERALL':
          fns.fetchFn = StatisticsService.getOverallRanking;
          fns.setState = setOveralRankings;
          break;
      }

      const res = await fns.fetchFn({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });

      fns.setState(res.items);  
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = () => {
    if (rankingType === 'OVERALL') {
      StatisticsService.getOverallRankingExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else if (rankingType === 'DCP') {
      StatisticsService.getDcpRankingExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else if (rankingType === 'LR') {
      StatisticsService.getLrRankingExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else {
      StatisticsService.getOverallRankingExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    }
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

  const filterByCustomDates = (dateField: string, date: Date | null) => {
    setDateFilter((prev) => ({
      ...dateFilter,
      [dateField]: date
    }));
    setViewType('Custom');
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction="column" >
      <Grid item >
        <Header
          pageName="Xếp hạng thi đua nề nếp"
          searchBarPlaceholder="Tìm kiếm lớp..."
          onTextChange={(text) => setClassFilter(text)}
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
              <FormControl className={classes.rankingTypeSelector}>
                <Select
                  labelId="ranking-type-select"
                  id="simple-select"
                  value={rankingType}
                  onChange={handleRankingTypeChange}
                  placeholder="Loại vi phạm"
                >
                  <MenuItem value={'OVERALL'}>Tổng thể</MenuItem>
                  <MenuItem value={'DCP'}>Nề nếp</MenuItem>
                  <MenuItem value={'LR'}>Sổ đầu bài</MenuItem>
                </Select>
              </FormControl>
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
                    onChange={(date) => filterByCustomDates('startTime', date)}
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
                    onChange={(date) => filterByCustomDates('endTime', date)}
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
          {
            rankingType === 'OVERALL' && (
            <DataGrid
              columns={overallCols}
              rows={overalRankings.filter(x => x.className.includes(classFilter))}
              paginationMode='server'
              hideFooterPagination
              loading={loading}
              hideFooter
              getRowId={data => data.classId}
              localeText={dataGridLocale}
            />
            )
          }
          {
            rankingType === 'DCP' && (
            <DataGrid
              columns={dcpCols}
              rows={dcpRankings.filter(x => x.className.includes(classFilter))}
              paginationMode='server'
              hideFooterPagination
              loading={loading}
              hideFooter
              getRowId={data => data.classId}
              localeText={dataGridLocale}
            />
            )
          }
          {
            rankingType === 'LR' && (
            <DataGrid
              columns={lrCols}
              rows={lrRankings.filter(x => x.className.includes(classFilter))}
              paginationMode='server'
              hideFooterPagination
              loading={loading}
              hideFooter
              getRowId={data => data.classId}
              localeText={dataGridLocale}
            />
            )
          }
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DCPRankingPage;