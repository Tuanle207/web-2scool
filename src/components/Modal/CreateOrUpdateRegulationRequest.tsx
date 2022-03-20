import { FC, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, 
  FormHelperText, RadioGroup, FormControlLabel, Radio, FormLabel, Container } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useDialogController } from '../../hooks';
import { Regulation } from '../../interfaces';
import { IFilterOption } from '../FilterButton';

export interface CreateOrUpdateRegulationRequestProps {
  editItem?: Regulation.RegulationDto;
  criterias: Regulation.CriteriaForSimpleList[];
  regulationTypes: IFilterOption[];
}

const CreateOrUpdateRegulationRequest: FC<CreateOrUpdateRegulationRequestProps> = ({
  editItem,
  criterias,
  regulationTypes
}) => {
  
  const { control, handleSubmit, reset } =  useForm<Regulation.CreateUpdateRegulationDto>({
    defaultValues: {
      displayName: '',
      criteriaId: criterias.length > 0 ? criterias[0].id : undefined,
      point: 0,
      type: regulationTypes.length > 0 ? regulationTypes[0].id : undefined,
    }
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (editItem) {
      const { displayName, point, criteriaId, type } = editItem;
      reset({ displayName, point, criteriaId, type });
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  return (
    <Container>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="displayName"
          rules={{
            required: "Bạn cần nhập tên quy định",
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              label="Tên quy định"
              autoComplete="off"
              fullWidth
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
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
              label="Điểm trừ"
              autoComplete="off"
              fullWidth
              type="number"
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="criteriaId"
          rules={{
            required: "Bạn cần chọn tiêu chí",
          }}
          render={({field, fieldState: { error }}) => (
            <FormControl fullWidth variant="standard" error={!!error} >
              <InputLabel id="criteria-input-label">Tiêu chí</InputLabel>
              <Select
                labelId="criteria-input-label"
                id="criteria-input"
                label="Tiêu chí"
                {...field}
              >
                {
                  criterias.map((option, index) => (
                    <MenuItem key={index} value={option.id}>{ option.name }</MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="type"
          rules={{
            required: "Bạn cần chọn loại vi phạm",
          }}
          render={({field, fieldState: { error }}) => (
            <FormControl fullWidth variant="standard" error={!!error} >
              <FormLabel>Loại quy định</FormLabel>
              <RadioGroup row aria-label="quiz" 
                style={{ marginTop: 8, justifyContent: "center" }}
                {...field}
              >
              {
                regulationTypes.map((option, index) => (
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
    </Container>
  );
};

export default CreateOrUpdateRegulationRequest;