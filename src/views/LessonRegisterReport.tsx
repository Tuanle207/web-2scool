/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, List, ListItem, Typography, Tooltip, IconButton } from '@material-ui/core';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { LrReportsService } from '../api';
import { useFetch, usePagingInfo } from '../hooks';
import { Class, DcpReport } from '../interfaces';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatTime, getDayOfWeek } from '../utils/TimeHelper';
import { Alarm as AlarmIcon  } from '@material-ui/icons';
import BxBxsBookReaderIcon from '@material-ui/icons/LocalLibrary';
import PhotoIcon from '@material-ui/icons/Photo';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router';
import useStyles from '../assets/jss/views/LessonRegisterReport';

const LRCard = ({
  index,
  creationTime,
  point,
  absence,
  classInfo,
  photo
}: {
  index: number;
  creationTime: Date;
  point: number;
  absence: number;
  classInfo: Class.ClassForSimpleListDto;
  photo: string;
}) => {

  const classes = useStyles();

  return (
    <Grid key={index} container direction='row' className={classes.cardContainer} >
      <Grid item container direction='column' justify='space-between' style={{width: 'auto'}} >
        <Grid item container alignItems='center' style={{ width: 'auto' }}>
            <BxBxsBookReaderIcon />
            <Typography variant={'body1'} style={{marginLeft: 8}}>{ classInfo.name || '' }</Typography>
        </Grid>
        <Grid item container alignItems='center' style={{ width: 'auto'}} >
            <AlarmIcon />
            <Typography variant={'body1'} style={{marginLeft: 8}} > {`${getDayOfWeek(creationTime.toLocaleString())} - ${formatTime(creationTime.toLocaleString())}`} </Typography>
        </Grid>
        <Grid item container alignItems='center' style={{ width: 'auto' }} >
          <ControlPointIcon />
          <Typography variant={'body1'} style={{marginLeft: 8}} > {`Tổng điểm: ${point}`} </Typography>
        </Grid>
        <Grid item container alignItems='center' style={{ width: 'auto' }} >
            <RemoveCircleOutlineIcon />
            <Typography variant={'body1'} style={{marginLeft: 8}} > {`Số lượt vắng: ${absence}`} </Typography>
        </Grid>
      </Grid>
      <Grid item container 
        direction='row'
        justify='center'
        alignItems='center'
        style={{width: 'auto', flex: 1}}
      > 
        <Grid item container className={classes.imgContainer}>
          <Tooltip title='Ảnh chụp sổ đầu bài'>
            <PhotoIcon className={classes.imgIcon} />
          </Tooltip>
          <img 
            src={`http://${photo}`}
            alt='test img'
          />
        </Grid>
      </Grid>
      <IconButton aria-label='setting' className={classes.settingBtn}>
        <SettingsIcon />
      </IconButton>
    </Grid>
  );
};


const LessonRegisterReport = () => {
  
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    document.title = '2Cool | Nộp sổ đầu bài';
  }, []);

  const {pagingInfo, setPageIndex} = usePagingInfo();
  
  const {loading, data, error, resetCache} = useFetch<DcpReport.LRReportDto>(
    LrReportsService.getMyLrReports, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 }
  );
  const [items, setItems] = React.useState<DcpReport.LRReportDto[]>([]);

  React.useEffect(() => {
    const firstItem = data.items.length > 0 ? data.items[0] : null;
    if (firstItem && items.findIndex(x => x.id === firstItem.id) === -1) {
      setItems(prev => [...prev, ...data.items]);
    }
  }, [data]);



  return (
    <div style={{ height: '100%' }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'my-lr-report'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction='column'>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
               
               
              <Grid item container alignItems='flex-end' justify='flex-end' style={{width: 'auto'}}>
                <Button variant={'contained'} color={'primary'} onClick={() => history.push('lr-report-creation')} >
                  Nộp sổ đầu bài
                </Button>
              </Grid>
              
            </Grid>              
            <Grid item container direction='column' style={{ flex: '1 1 0', minHeight: 0, overflowX: 'hidden', overflowY: 'auto' }}>
              <List className={classes.list}>
                {
                  items.map((el, index) => (
                  <ListItem key={el.id}>
                    <LRCard 
                      index={index}
                      creationTime={el.creationTime}
                      point={el.totalPoint}
                      absence={el.absenceNo}
                      classInfo={el.class}
                      photo={el.attachedPhotos[0]}
                    />
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
                    <p className={classes.emptyText}>Không có phiếu chấm điểm nào đang chờ duyệt!</p>
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

export default LessonRegisterReport;