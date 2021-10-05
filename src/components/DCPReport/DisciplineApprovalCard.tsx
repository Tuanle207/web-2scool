import React from 'react';
import { Button, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Alarm as AlarmIcon, CheckSharp, Clear, PermContactCalendar as PermContactCalendarIcon,  } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import BxBxsBookReaderIcon from '@material-ui/icons/LocalLibrary';
import RestoreIcon from '@material-ui/icons/Restore';
import { DcpReport } from '../../common/interfaces';
import { formatTime, getDayOfWeek } from '../../common/utils/TimeHelper';
import ActionModal from '../Modal';
import { DcpReportsService } from '../../common/api';
import { toast } from 'react-toastify';
import { dcpReportStatus } from '../../common/appConsts';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    border: `1px solid ${theme.palette.grey.A700}`,
    padding: theme.spacing(2, 4)
  },
  rejectBtn: {
    color: theme.palette.error.main,
    
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main
    }
  },
  acceptBtn: {
    '&:hover':{
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const DisciplineApprovalCard = ({data}: {data: DcpReport.DcpReportDto}) => {

  const classes = useStyles();
  const history = useHistory();

  const handleAccept = (id: string) => {
    ActionModal.show({
      title: 'Xác nhận duyệt phiếu chấm này?',
      onAccept: async () => {
        await DcpReportsService.acceptDcpReport([id]);
        toast('Duyệt thành công!', {
          type: 'success'
        });
      } 
    })
  };

  const handleReject = (id: string) => {
    ActionModal.show({
      title: 'Xác nhận từ chối phiếu chấm này?',
      onAccept: async () => {
        await DcpReportsService.rejectDcpReport(id);
        toast('Từ chối thành công!', {
          type: 'success'
        });
      } 
    })
  };

  return (
    <Grid key={data.id} container direction={'row'} className={classes.container} >
      <Grid item container direction={'row'} justify={'flex-start'} style={{flex: 4}}>
        <Grid item container alignItems={'center'} style={{flex: 1}}>
          <Grid item>
            <AlarmIcon />
          </Grid>
          <Grid item style={{marginLeft: 8}}>
            <Typography variant={'body1'} > {`${getDayOfWeek(data.creationTime.toLocaleString())} - ${formatTime(data.creationTime.toLocaleString())}`} </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems={'center'} style={{flex: 1}}>
          <Grid item>
            <PermContactCalendarIcon />
          </Grid>
          <Grid item style={{marginLeft: 8}}>
            <Typography variant={'body1'} >{data.creator ? data.creator.name : ''}</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems={'center'} style={{marginTop: 16}}>
          <Grid item>
            <BxBxsBookReaderIcon />
          </Grid>
          <Grid item style={{marginLeft: 8}}>
            <Typography variant={'body1'} > {data.dcpClassReports.map(el => el.class.name).join(', ')} </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container 
        direction='column'
        justify='space-between' 
        style={{flex: 1}}
      > 
        <Grid item container justify={data.status === dcpReportStatus.Created ? 'flex-start' : 'center'}>
          {
            data.status === dcpReportStatus.Created && (
              <Tooltip title='Hủy duyệt'>
                <IconButton 
                  className={classes.rejectBtn} 
                  onClick={() => handleReject(data.id)}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
            )                    
          }
          {
            data.status === dcpReportStatus.Created && (
            <Tooltip title='Duyệt'>
              <IconButton 
                color={'primary'} 
                className={classes.acceptBtn}
                onClick={() => handleAccept(data.id)}
              >
                <CheckSharp />
              </IconButton>
            </Tooltip>
            )                    
          }
          {
              [dcpReportStatus.Approved, dcpReportStatus.Rejected].includes(data.status) && (
              <Tooltip title='Bỏ duyệt'>
                <IconButton
                  className={classes.rejectBtn} 
                >
                  <RestoreIcon />
                </IconButton>
              </Tooltip>
              
            )
          }
          
        </Grid>
        <Grid item>
          <Button onClick={() => history.push(`/dcp-report-approval/${data.id}`)} 
            color={'primary'}>Xem chi tiết...</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DisciplineApprovalCard;