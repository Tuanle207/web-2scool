/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, Button, makeStyles, List, ListItem, Chip } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DisciplineApprovalCard from '../components/DCPReport/DisciplineApprovalCard';
import { DcpReportsService } from '../common/api';
import { useFetch, usePagingInfo } from '../hooks';
import { DcpReport } from '../common/interfaces';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatDate } from '../common/utils/TimeHelper';
import { comparers, dcpReportStatus } from '../common/appConsts';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    // overflowY: 'scroll'
    padding: '20px 100px' 
  },
  emptyText: {
    color: theme.palette.grey[500],
    textAlign: 'center'
  }
}));


const DCPReportsApprovalPage = () => {
  
  const classes = useStyles();

  React.useEffect(() => {
    document.title = '2Cool | Lịch sử duyệt chấm điểm nề nếp';
  }, []);

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo({
    filter: [
      {
        key: 'Status',
        comparison: '',
        value: dcpReportStatus.Approved
      },
      {
        key: 'Status',
        comparison: '',
        value: dcpReportStatus.Rejected
      },
      {
        key: 'StartDate',
        comparison: comparers.Eq,
        value: formatDate(new Date().toLocaleString(), 'MM/DD/YYYY')
      },
      {
        key: 'EndDate',
        comparison: comparers.Eq,
        value: formatDate(new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString(), 'MM/DD/YYYY')
      }
    ]
  });
  const {loading, data, error, resetCache} = useFetch<DcpReport.DcpReportDto>(
    DcpReportsService.getDcpReportsForApproval, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 }
  );
  const [items, setItems] = React.useState<DcpReport.DcpReportDto[]>([]);
  const [dateFilter, setDateFilter] = React.useState<Date | null>(new Date());
  const [dateFilterType, setDateFilterType] = React.useState<string>('today');

  React.useEffect(() => {
    const firstItem = data.items.length > 0 ? data.items[0] : null;
    if (firstItem && items.findIndex(x => x.id === firstItem.id) === -1) {
      setItems(prev => [...prev, ...data.items]);
    }
  }, [data]);

  const handleOnDateChange = (date: Date | null) => {
    setDateFilter(date);
    if (date !== null) {
      const start = new Date(date);
      const end = start.getDate() + 1;
      const startDate = new Date(start);
      const endDate = new Date(start.setDate(end));
      setFilter({
        key: 'StartDate',
        comparison: comparers.Eq,
        value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
      });
      setFilter({
        key: 'EndDate',
        comparison: comparers.Eq,
        value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
      });
      setItems([]);
      setPageIndex(0);
      resetCache();
    }
    
  };

  const handleWeekFilterClick = () => {
    setDateFilterType('week');
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); 
    let start = now.getDate() - dayOfWeek + 1;
    const end = start + 6;
    const startDate = new Date(now.setDate(start));
    const endDate = new Date(now.setDate(end));

    setFilter({
      key: 'StartDate',
      comparison: comparers.Eq,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'EndDate',
      comparison: comparers.Eq,
      value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setItems([]);
    setPageIndex(0);
    resetCache();
  };


  const handleTodayFilterClick = () => {
    setDateFilterType('today');
    const now = new Date();
    const end = now.getDate() + 1;
    const startDate = new Date(now);
    const endDate = new Date(now.setDate(end));

    setFilter({
      key: 'StartDate',
      comparison: comparers.Eq,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'EndDate',
      comparison: comparers.Eq,
      value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setItems([]);
    setPageIndex(0);
    resetCache();
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'dcp-report-history'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction='column'>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' style={{width: 'auto'}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box>
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      variant="dialog"
                      format="dd/MM/yyyy"
                      margin="dense"
                      id="get-discipline-report-filter"
                      label="Chọn ngày chấm"
                      value={dateFilter}
                      onChange={handleOnDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Box>
                </MuiPickersUtilsProvider>
                <Chip 
                    clickable label='Hôm nay' 
                    onClick={handleTodayFilterClick}
                    variant={dateFilterType === 'today' ? 'default' : 'outlined'} 
                    color={dateFilterType === 'today' ? 'primary' : 'default'} style={{marginLeft: 16}}
                    />
                <Chip clickable label='Tuần này' 
                  onClick={handleWeekFilterClick}
                  variant={dateFilterType === 'week' ? 'default' : 'outlined'} 
                  color={dateFilterType === 'week' ? 'primary' : 'default'}
                  style={{marginLeft: 8}}
                />
              </Grid>
              
            </Grid>              
            <Grid item container direction='column' style={{ flex: '1 1 0', minHeight: 0, overflowX: 'hidden', overflowY: 'auto' }}>
              <List className={classes.list}>
                {
                  items.map(el => (
                  <ListItem key={el.id}>
                    <DisciplineApprovalCard data={el} />
                  </ListItem>))
                }
                {
                  loading && (
                    
                    <Grid container justify='center' alignItems='center'>
                      <p className={classes.emptyText}>Đang tải ...</p>
                    </Grid>
                  )
                }
                {
                  !loading && pagingInfo.pageIndex! + 1 < data.totalCount / pagingInfo.pageSize! && (
                    <Grid container justify='center' alignItems='center' style={{marginTop: 8, marginBottom: 8}}>
                      <Button
                        variant='contained'
                        color='primary'
                        startIcon={<ExpandMoreIcon />}
                        onClick={() => setPageIndex((pagingInfo.pageIndex || 0) + 1)}
                      >
                        Tải thêm
                      </Button>
                    </Grid>
                  )
                }
              </List>
              {
                !loading && items.length === 0 && (
                  
                  <Grid container justify='center' alignItems='center' style={{flex: 1}}>
                    <p className={classes.emptyText}>Không có phiếu chấm điểm nào!</p>
                  </Grid>
                )
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

};

export default DCPReportsApprovalPage;