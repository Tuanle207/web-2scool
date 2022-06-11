/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, Typography, Tooltip, TextField, Paper } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { Alarm as AlarmIcon  } from '@material-ui/icons';
import BxBxsBookReaderIcon from '@material-ui/icons/LocalLibrary';
import PhotoIcon from '@material-ui/icons/Photo';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import DoneIcon from '@material-ui/icons/Done';
import PlaceholderImage from '../assets/img/placeholder-img.png';
import { formatTime, getDayOfWeek } from '../utils/TimeHelper';
import { toast } from 'react-toastify';
import { LrReportsService, TaskAssignmentService } from '../api';
import { taskType } from '../appConsts';
import { Class } from '../interfaces';
import useStyles from '../assets/jss/views/LessonRegisterReportCreate';
import { getFullUrl } from '../utils/ImageHelper';
import { busyService, dialogService } from '../services';


const LessonRegisterReportUpdate = () => {
  
  const classes = useStyles();
  const history = useHistory();
  const params = useParams<{lrReportId: string}>();

  const inputRef = React.useRef(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string>(PlaceholderImage);
  const [noPoint, setNoPoint] = React.useState(0);
  const [noAbsence, setNoAbsence] = React.useState(0);
  const [reportClass, setReportClass] = React.useState<Class.ClassForSimpleListDto>();

  React.useEffect(() => {
    getData();

    document.title = '2Cool | Cập nhật phiếu nộp sổ đầu bài';
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

  const getData = async() => {
    const { lrReportId } = params;
    const res = await LrReportsService.getLrReportById(lrReportId);
    setFileUrl(getFullUrl(res.attachedPhotos[0]));
    setNoPoint(res.totalPoint);
    setNoAbsence(res.absenceNo);
    setReportClass(res.class);
  };


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

  const handleSubmit = async () => {
    if (!reportClass) {
      return toast.error('Bạn không được phân công giữ sổ đầu bài!');
    }
    if (noAbsence < 0) {
      return toast.error('Số lượt vắng không hợp lệ');
    }
    if (file == null && (fileUrl === PlaceholderImage || !fileUrl)) {
      return toast.error('Vui lòng đính kèm ảnh Sổ Đầu Bài');
    }
    const { lrReportId } = params;

    const { result } = await dialogService.show(null, {
      title: 'Xác nhận cập nhật phiếu nộp sổ đầu bài',
    });

    if (result === 'Ok') {
      try {
        busyService.busy(true);
        await LrReportsService.updateLrReport(lrReportId, {
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
      } finally {
        busyService.busy(false);
      }
    }
  };

  return (
    <Grid style={{ height: '100%' }} item container direction='column'>
      <Header pageName="Cập nhật phiếu nộp sổ đầu bài" />
      <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>   
        <Grid item container direction='column' justify='center' alignItems='center' style={{ flex: 1, background: "#e8e8e8" }}>
          {
            reportClass ? (
              <Paper style={{ margin: "0 24px" }}>
                <form className={classes.formContainer}>
                  <Grid item container direction='column' justify='space-between' style={{width: 'auto'}} >
                    <Grid item container alignItems='center' style={{ width: 'auto' }}>
                        <BxBxsBookReaderIcon />
                        <Typography variant={'body1'} style={{marginLeft: 8}}>{reportClass?.name || 'Bạn không được phân công giữ sổ đầu bài'}</Typography>
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
                      Chọn ảnh sổ đầu bài
                      <input ref={inputRef} type='file' hidden onChange={handleFileChange} accept="image/*" />
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
                  <Grid item container justify='flex-end' style={{ paddingTop: 40 }}>
                    <Button
                      variant={'contained'} 
                      color={'primary'} 
                      endIcon={<DoneIcon />} 
                      onClick={handleSubmit}
                      style={{marginRight: 200}}
                      >
                      Cập nhật phiếu nộp sổ đầu bài
                    </Button>
                  </Grid>
                </form>
              </Paper>
            ) : (
              <>
                <Typography variant={'body1'} style={{marginLeft: 8}}>Bạn không được phân công giữ sổ đầu bài!</Typography>
                <Button color="primary" onClick={() => history.goBack()}>Quay lại trang trước</Button>
              </>
            )
          }
        </Grid>
      </Grid>
    </Grid>
  );

};

export default LessonRegisterReportUpdate;