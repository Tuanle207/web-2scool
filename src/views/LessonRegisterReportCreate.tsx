/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, makeStyles, Typography, Tooltip, TextField, Paper } from '@material-ui/core';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Alarm as AlarmIcon  } from '@material-ui/icons';
import BxBxsBookReaderIcon from '@material-ui/icons/LocalLibrary';
import PhotoIcon from '@material-ui/icons/Photo';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import SendIcon from '@material-ui/icons/Send';
import PlaceholderImage from '../assets/img/placeholder-img.png';
import { useHistory } from 'react-router';
import { formatTime, getDayOfWeek } from '../common/utils/TimeHelper';
import { toast } from 'react-toastify';
import { LrReportsService, TaskAssignmentService } from '../common/api';
import ActionModal from '../components/Modal';
import { taskType } from '../common/appConsts';
import { Class } from '../common/interfaces';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  imgContainer: {
    margin: theme.spacing(0, 8),
    marginTop: theme.spacing(1),
    width: 'auto', 
    position: 'relative',
    '& > img': {
      height: 300,
      width: 400,
      objectFit: 'cover'
    }
  },
  imgIcon: {
    position: 'absolute', 
    top: 10, 
    left: 10,
    zIndex: 1
  },
  formContainer: {
    display: 'flex',
    padding: theme.spacing(6, 8)
  }
}));


const LessonRegisterReportCreate = () => {
  
  const classes = useStyles();
  const history = useHistory();

  const inputRef = React.useRef(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string>(PlaceholderImage);
  const [noPoint, setNoPoint] = React.useState(0);
  const [noAbsence, setNoAbsence] = React.useState(0);
  const [reportClass, setReportClass] = React.useState<Class.ClassForSimpleListDto>({} as Class.ClassForSimpleListDto);

  React.useEffect(() => {
    document.title = '2Cool | Nộp sổ đầu bài';
  }, []);

  React.useEffect(() => {
    if (file != null) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
    TaskAssignmentService.getAssignedClassesForDcpReport(taskType.LessonRegisterReport)
      .then(classRes => {
        if (classRes.items.length > 0) {
          setReportClass(classRes.items[0])
        }
      })
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleOpenFileDialog = () => {
    const instance = inputRef?.current;
    if (instance) {
      (instance as any).click();
    }
  };

  const handleSubmit = () => {
    if (!reportClass.id) {
      return toast.error('Bạn không được phân công giữ sổ đầu bài!');
    }
    if (noPoint < 0 || noAbsence < 0) {
      return toast.error('Tổng điểm không hợp lệ');
    }
    if (noPoint < 0 || noAbsence < 0) {
      return toast.error('Tổng điểm không hợp lệ');
    }
    if (file == null) {
      return toast.error('Vui lòng đính kèm ảnh Sổ Đầu Bài');
    }
    
    ActionModal.show({
      title: 'Xác nhận gửi sổ đầu bài',
      onAccept: async () => {
        try {
          await LrReportsService.createLrReport({
            classId: reportClass.id,
            absenceNo: noAbsence,
            totalPoint: noPoint,
            photo: file,
          });
          toast.success('Thành công!');
          history.goBack();
        } catch (e) {
          console.log(e);
          toast.error('Đã có lỗi xảy ra!')
        }
      },
    })
  };

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
              <Grid item container direction='row' alignItems='center' style={{width: 'auto'}}>
                <p>Thông tin sổ đầu bài</p>
              </Grid>
              <Grid item container alignItems='flex-end' justify='flex-end' style={{width: 'auto'}}>
                <Button
                  variant={'contained'} 
                  color={'primary'} 
                  endIcon={<SendIcon />} 
                  onClick={handleSubmit}
                  >
                  Gửi sổ đầu bài
                </Button>
              </Grid>
              
            </Grid>              
            <Grid item container direction='column' justify='center' alignItems='center' style={{ flex: 1 }}>
              <Paper>
                <form className={classes.formContainer}>
                  <Grid item container direction='column' justify='space-between' style={{width: 'auto'}} >
                    <Grid item container alignItems='center' style={{ width: 'auto' }}>
                        <BxBxsBookReaderIcon />
                        <Typography variant={'body1'} style={{marginLeft: 8}}>{reportClass.name || 'Bạn không được phân công giữ sổ đầu bài'}</Typography>
                    </Grid>
                    <Grid item container alignItems='center' style={{ width: 'auto'}} >
                        <AlarmIcon />
                        <Typography variant={'body1'} style={{marginLeft: 8}} > {`${getDayOfWeek(new Date().toLocaleString())} - ${formatTime(new Date().toLocaleString())}`} </Typography>
                    </Grid>
                    <Grid item container alignItems='center' style={{ width: 'auto' }} >
                      <ControlPointIcon style={{marginTop: 16, marginRight: 8}} />
                      <TextField
                        label='Tổng điểm'
                        type='number'
                        value={noPoint}
                        onChange={e => setNoPoint(parseInt(e.target.value))}
                      />
                    </Grid>
                    <Grid item container alignItems='center' style={{ width: 'auto' }} >
                      <RemoveCircleOutlineIcon style={{marginTop: 16, marginRight: 8}} />
                      <TextField
                        label='Số lượt vắng'
                        type='number'
                        value={noAbsence}
                        onChange={e => setNoAbsence(parseInt(e.target.value))}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container 
                    direction='column'
                    justify='center'
                    alignItems='center'
                    style={{width: 'auto', flex: 1}}
                  > 
                    <Button
                      startIcon={<AddAPhotoIcon/>}
                      onClick={handleOpenFileDialog}
                    >
                      Chọn ảnh
                      <input ref={inputRef} type='file' hidden onChange={handleFileChange} />
                    </Button>
                    {
                      fileUrl !== null && (
                      <Grid item container className={classes.imgContainer}>
                        <Tooltip title='Ảnh chụp sổ đầu bài'>
                          <PhotoIcon className={classes.imgIcon} />
                        </Tooltip>
                        <img 
                          src={fileUrl}
                          alt='test img'
                        />
                      </Grid>
                      )
                    }
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

};

export default LessonRegisterReportCreate;