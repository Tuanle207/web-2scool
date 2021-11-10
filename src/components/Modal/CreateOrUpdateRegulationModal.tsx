import { Box, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText, RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ActionModal, { IActionModalProps } from './ActionModal';
import { Regulation } from '../../interfaces';
import useModalStyles from './modal.style';
import { IFilterOption } from '../FilterButton';

interface ICreateOrUpdateRegulationModalProps extends IActionModalProps {
  onSuccess?: (data: any) => void;
  dataId?: string;
  criteriaOptions?: IFilterOption[];
  regulationTypeOptions?: IFilterOption[];
}

const CreateOrUpdateRegulationModal: FC<Omit<ICreateOrUpdateRegulationModalProps, "children">> = ({
  open,
  dataId,
  onRequestClose,
  onSuccess = () => {},
  confirmBeforeExit,
  criteriaOptions = [],
  regulationTypeOptions = [],
  ...rest
}) => {
  
  const styles = useModalStyles();

  const [ title, setTitle ] = useState('Thêm quy định mới');
  const [ notifyIsDirty, setNotifyIsDirty] = useState(false);

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<Regulation.CreateUpdateRegulationDto>({
    defaultValues: {
      displayName: ''
    }
  });

  useEffect(() => {
    if (dataId) {
      setTitle('Cập nhật quy định');
      
      // init data
    }
  }, [dataId]);

  const onCancel = () => {
    if (isDirty && !notifyIsDirty) {
      setNotifyIsDirty(true);
    } else {
      onRequestClose();
      setNotifyIsDirty(false);
      reset();
    }
  };

  const onSubmit = (data: Regulation.CreateUpdateRegulationDto) => {
    console.log({data});
  };
  
  return (
    <ActionModal
      open={open}
      onRequestClose={onCancel}
      confirmBeforeExit={notifyIsDirty}
      title={title}
      {...rest}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box width={400}>
          <Controller
            control={control}
            name="displayName"
            rules={{
              required: "Bạn cần nhập tên quy định",
            }}
            render={({field: { ref, value, onChange, onBlur }, fieldState: { error }}) => (
              <TextField
                className={styles.field}
                label="Tên quy định"
                autoComplete="off"
                fullWidth
                variant="outlined"
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="point"
            rules={{
              required: "Bạn cần nhập điểm trừ",
              validate: (value: number) => {
                if (value.toString().includes('.')) {
                  return "Vui lòng nhập 1 số tự nhiên";
                } else if (value <= 0) {
                  return "Vui lòng nhập một số dương";
                }
              }
            }}
            render={({field: { ref, value, onChange, onBlur }, fieldState: { error }}) => (
              <TextField
                className={styles.field}
                label="Điểm trừ"
                autoComplete="off"
                fullWidth
                variant="outlined"
                type="number"
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="criteriaId"
            rules={{
              required: "Bạn cần chọn tiêu chí",
            }}
            render={({field: { ref, value, onChange, onBlur }, fieldState: { error }}) => (
              <FormControl fullWidth variant="outlined" className={styles.field} error={!!error} >
                <InputLabel id="criteria-input-label">Tiêu chí</InputLabel>
                <Select
                  labelId="criteria-input-label"
                  id="criteria-input"
                  label="Tiêu chí"
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  {
                    criteriaOptions.map((option, index) => (
                      <MenuItem key={index} value={option.value}>{ option.label }</MenuItem>
                    ))
                  }
                </Select>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="type"
            rules={{
              required: "Bạn cần chọn loại vi phạm",
            }}
            render={({field: { ref, value, onChange, onBlur }, fieldState: { error }}) => (
              <FormControl fullWidth variant="outlined" className={styles.field} error={!!error} >
                <FormLabel>Loại quy định</FormLabel>
                <RadioGroup row aria-label="quiz" 
                  name="regulationType"
                  style={{ marginTop: 8, justifyContent: "center" }}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                {
                  regulationTypeOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option.value}
                      control={<Radio color="primary"/>}
                      label={option.label}
                    />
                  ))
                }
                </RadioGroup>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ marginTop: 24, padding: "0 24px"}}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            { dataId ? "Lưu thay đổi" : "Thêm" }
          </Button>
        </Grid>
      </Box>
    </ActionModal>
  );
};

export default CreateOrUpdateRegulationModal;