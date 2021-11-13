import { Box, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel, 
  FormHelperText, RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import DataModal, { IDataModalProps } from './DataModal';
import { Regulation } from '../../interfaces';
import useModalStyles from './modal.style';
import { IFilterOption } from '../FilterButton';
import { RegulationsService } from '../../api';

interface ICreateOrUpdateRegulationModalProps extends IDataModalProps{
  onSuccess?: (data: Regulation.RegulationDto) => void;
  item?: Regulation.RegulationDto;
  criteriaOptions?: IFilterOption[];
  regulationTypeOptions?: IFilterOption[];
  onClose?: () => void;
}

const CreateOrUpdateRegulationModal: FC<ICreateOrUpdateRegulationModalProps> = ({
  isOpen,
  item,
  onRequestClose,
  onSuccess = () => {},
  confirmBeforeExit,
  criteriaOptions = [],
  regulationTypeOptions = [],
  onClose = () => {},
  ...rest
}) => {
  
  const styles = useModalStyles();

  const [ title, setTitle ] = useState('Thêm quy định mới');
  const [ notifyIsDirty, setNotifyIsDirty] = useState(true);

  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting }, } = useForm<Regulation.CreateUpdateRegulationDto>();

  useEffect(() => {
    if (item) {
      setTitle('Cập nhật quy định');
      reset({
        displayName: item.displayName,
        point: item.point,
        criteriaId: item.criteriaId,
        type: item.type,
      })
    } else {
      setTitle('Thêm quy định mới');
    }
  }, [item]);


  const handleClose = (data?: Regulation.RegulationDto) => {
    reset({});
    onRequestClose();
    setNotifyIsDirty(false);
    if (data) {
      onSuccess(data);
    }
    onClose();
  };

  const onCancel = () => {
    if (isDirty && !notifyIsDirty) {
      setNotifyIsDirty(true);
    } else {
      handleClose();
    }
  };

  const onSubmit = async (data: Regulation.CreateUpdateRegulationDto) => {
    const TOAST_ID = toast.loading("Đang lưu quy định...");
    try {
      let result: Regulation.RegulationDto;
      if (item) {
        result = await RegulationsService.updateRegulation(item.id, data);
      } else {
        result = await RegulationsService.createRegulation(data);
      }
      toast.update(TOAST_ID, {
        render: "Lưu thành công!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      handleClose(result);
    } catch (err: any) {
      toast.update(TOAST_ID, {
        render: err?.message || '',
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    }
  };

  return (
    <DataModal
      isOpen={isOpen}
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
            render={({field, fieldState: { error }}) => (
              <TextField
                className={styles.field}
                label="Tên quy định"
                autoComplete="off"
                fullWidth
                variant="outlined"
                {...field}
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
            render={({field, fieldState: { error }}) => (
              <TextField
                className={styles.field}
                label="Điểm trừ"
                autoComplete="off"
                fullWidth
                variant="outlined"
                type="number"
                {...field}
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
            disabled={isSubmitting}
          >
            { item ? "Lưu thay đổi" : "Thêm" }
          </Button>
        </Grid>
      </Box>
    </DataModal>
  );
};

export default CreateOrUpdateRegulationModal;