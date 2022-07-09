import React, { FC, useEffect, useState } from 'react';
import { Grid, TextField, Tabs, Tab, Button } from '@material-ui/core';
import Header from '../components/Header';
import { AppSetting } from '../interfaces';
import { AppSettingService } from '../api';
import useStyles from '../assets/jss/views/ProfilePage';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import TabPanel, { a11yProps } from '../components/TabPanel';
import { appSettingType } from '../appConsts';

interface IReportSettingTabContentProps { }

interface SettingFormData {
  dcpRatio: number;
  lrRatio: number;
  startDcpPoint: number;
}

const ReportSettingTabContent: FC<IReportSettingTabContentProps> = () => {

  const [ settings, setSettings ] = useState<AppSetting.AppSettingDto[]>([]);

  useEffect(() => {
    AppSettingService.getReportAppSetting()
      .then(({items}) => setSettings(items));
  }, []);

  const { control, handleSubmit, reset } = useForm<SettingFormData>({
    defaultValues: {
      dcpRatio: 0,
      lrRatio: 0,
      startDcpPoint: 0
    }
  });

  useEffect(() => {
    const lrRatio: number = +(settings.find(x => x.typeCode === appSettingType.LrPointRatio)?.value || '0');
    const dcpRatio: number = +(settings.find(x => x.typeCode === appSettingType.DcpPointRatio)?.value || '0');
    const startDcpPoint: number = +(settings.find(x => x.typeCode === appSettingType.StartDcpPoint)?.value || '0');

    reset({
      dcpRatio,
      lrRatio,
      startDcpPoint
    });

  // eslint-disable-next-line
  }, [settings]);

  const onSubmit = async (data: SettingFormData) => {
    try {
      const settings: AppSetting.CreateUpdateAppSettingDto[] = [];
      settings.push({
        typeCode: appSettingType.LrPointRatio,
        value: data.lrRatio.toString(),
      });
      settings.push({
        typeCode: appSettingType.DcpPointRatio,
        value: data.dcpRatio.toString(),
      });
      settings.push({
        typeCode: appSettingType.StartDcpPoint,
        value: data.startDcpPoint.toString(),
      });
      await AppSettingService.updateReportAppSetting(settings);
  
      toast.success('Thiết lập thông số thành công!!');
    } catch (err) {
      console.log({err});
      toast.error('Đã có lỗi xảy ra, không thể lưu thay đổi.');
    }
  };

  const onSubmitClick = (e: any) => {
    handleSubmit(onSubmit)(e);
  };

  return (
    <Grid container direction="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="startDcpPoint"
        control={control}
        rules={{
          required: "Vui lòng nhập điểm nề nếp ban đầu của tuần",
          validate: (value: number) => {
            if (+value < 0) {
              return "Vui lòng nhập một số không âm"
            }
          }
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="StartDcpPoint"
            label="Điểm nề nếp ban đầu của tuần" 
            type="number"
            autoComplete="new-value"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Controller
        name="dcpRatio"
        control={control}
        rules={{
          required: "Vui lòng nhập tỉ số điểm nề nếp",
          validate: (value: number) => {
            if (+value <= 0) {
              return "Vui lòng nhập một số dương"
            }
          }
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="DcpPointRatio"
            label="Tỉ số điểm nề nếp" 
            type="number"
            autoComplete="new-password"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Controller
        name="lrRatio"
        control={control}
        rules={{
          required: "Vui lòng nhập tỉ số điểm sổ đầu bài",
          validate: (value: number) => {
            if (+value <= 0) {
              return "Vui lòng nhập một số dương"
            }
          }
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="LrPointRatio"
            label="Tỉ số điểm sổ đầu bài" 
            type="number"
            autoComplete="new-password"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: 32 }} onClick={onSubmitClick}>Lưu</Button>
    </Grid>
  );
};

const AppSettingPage = () => {

  const classes = useStyles();
  
  const [ tabIndex, setTabIndex ] = useState(0);

  const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header pageName="Cài đặt" hiddenSearchBar />
      </Grid>
      <Grid item container direction='column' style={{ flexGrow: 1 }}>
        <Grid container justify='space-between' className={classes.tabContainer}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabIndex}
            onChange={onTabChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label="Thông số nề nếp" {...a11yProps(0)} />
            <Tab label="Thông tin trường" {...a11yProps(1)} />
            <Tab label="Khác" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0} className={classes.tabView}>
            <ReportSettingTabContent />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} className={classes.tabView}>
            Thông tin trường
          </TabPanel>
          <TabPanel value={tabIndex} index={2} className={classes.tabView}>
            Cài đặt khác
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AppSettingPage;