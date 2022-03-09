import { TextField } from '@material-ui/core';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

export interface IDataDto {
  name: string;
  age: number;
} 

export const TestBox = () => {

  const { control, handleSubmit } = useForm<IDataDto>({
    defaultValues: {
      name: '',
      age: 20
    }
  });

  useEffect(() => {
    
  }, []);

  const onSubmit = (data: IDataDto) => {
    // Dialog.setData({
    //   data
    // });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        rules={{
          required: "Vui lòng nhập tên"
        }}
        name="name"
        render={({field, fieldState: { error, invalid }}) => (
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            error={!!error}
            helperText={error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="age"
        rules={{
          required: {
            value: true,
            message: "Vui lòng nhập tuổi"
          },
          min: {
            value: 1,
            message: "Tuổi phải lớn hơn 0"
          }   
        }}
        render={({field, fieldState: { error, invalid }}) => (
          <TextField
            style={{ marginTop: 16 }}
            fullWidth
            label="Age"
            variant="outlined"
            error={invalid}
            helperText={error?.message}
            {...field}
          />
        )}
      />
    </form>
  )
};