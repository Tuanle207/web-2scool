import { 
  FC,
  useState,
  useEffect, 
  useMemo 
} from 'react';
import { 
  Container,
  Box,
  Radio, 
  RadioGroup, 
  RadioProps, 
  makeStyles,
  FormControl,
  FormHelperText,
  FormControlLabel,
  TextField, 
} from '@material-ui/core';
import { 
  KeyboardDatePicker, 
  MuiPickersUtilsProvider 
} from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { useDialogController } from '../../hooks';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { Account } from '../../interfaces';
import { AccountsService } from '../../api';
import ActionModal from '.';
import { withoutVNSign } from '../../utils/StringHelper';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

function StyledRadio(props: RadioProps) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export interface UpdateLRKeeperRequestProps {
  classId: string;
  assignedAccountId?: string;
  initStartTime?: Date;
  initEndTime?: Date;
}

export interface UpdateLRKeeperFormData {
  classId: string;
  accountId: string; 
  startTime: Date; 
  endTime: Date;
}

const UpdateLRKeeperRequest: FC<UpdateLRKeeperRequestProps> = ({
  classId,
  assignedAccountId,
  initStartTime,
  initEndTime
}) => {

  const { control, getValues, setValue, reset, handleSubmit } = useForm<UpdateLRKeeperFormData>({
    defaultValues: {
      classId: classId,
      accountId: assignedAccountId,
      startTime: initStartTime ?? new Date(),
      endTime: initEndTime ?? moment().add(3, 'months').toDate()
    },
  });

  useDialogController({ control, handleSubmit });

  const [ studentAccounts, setStudentAccounts ] = useState<Account.SimpleAccountDto[]>([]);
  const [ selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [ studentName, setStudentName ] = useState<string>('');
  const [ loadingData, setLoadingData ] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const { items } = await AccountsService.getTaskAssignmentAccounts(classId);
      setStudentAccounts(items);
      const assignee = items.find((x) => x.id === assignedAccountId);
      setValue('accountId', assignee ? assignee.id : '');
      // setSelectedAccountId(assignee ? assignee.id : null);
      // reset()

      setLoadingData(false);
    };

    initData();

  }, [classId, assignedAccountId]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAccountId((event.target as HTMLInputElement).value);
  };

  const filteredUsers = useMemo(() => {
    return studentAccounts.filter(item => withoutVNSign(item.name).toLowerCase().includes(studentName));
  }, [studentAccounts, studentName]) ;

  return (
    <Container>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm học sinh"
        size="small"
        fullWidth
        style={{ marginBottom: 24, marginTop: 8, }}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <Container style={{ height: 180, overflowY: "auto" }}>
        {
          loadingData ? (
            <p>Đang tải dữ liệu ...</p>
          ) : (
            <Controller
              control={control}
              name="accountId"
              rules={{
                required: "Bạn cần chọn học sinh giữ sổ đầu bài",
              }}
              render={({field, fieldState: { error }}) => (
                <FormControl fullWidth variant="standard" error={!!error}>
                  <FormHelperText>{error?.message}</FormHelperText>
                  <RadioGroup
                    defaultValue={assignedAccountId} 
                    {...field}
                  >
                    {
                      filteredUsers.map((item) =>  (
                        <FormControlLabel
                          key={item.id}
                          value={item.id} 
                          control={<StyledRadio />} 
                          label={item.name}
                        />
                      ))
                    }
                  </RadioGroup>
                </FormControl>
              )}
            />
          )
        }
        {
          !loadingData && filteredUsers.length === 0 && (
            <p>Không có học sinh nào.</p>
          )
        }
      </Container>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Box style={{ marginBottom: 16 }}>
          <Controller
            control={control}
            name="startTime"
            rules={{
              required: {
                value: true,
                message: 'Ngày bắt đầu là bắt buộc'
              },
              validate: (value: Date) => {
                if (moment(getValues('endTime')).isSameOrBefore(value)) {
                  return 'Ngày bắt đầu phải trước ngày kết thúc';
                }
              }
            }}
            render={({field, fieldState: { error }}) => (
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                required
                size="small"
                variant="dialog"
                format="dd/MM/yyyy"
                margin="dense"
                id="get-start-date"
                placeholder="Bắt đầu từ"
                label="Ngày bắt đầu"
                KeyboardButtonProps={{
                  "aria-label": "lr - keeper - start end date",
                }}
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          
        </Box>
        <Box style={{ marginBottom: 16 }}>
          <Controller
            control={control}
            name="endTime"
            rules={{
              required: {
                value: true,
                message: 'Ngày kết thúc là bắt buộc'
              },
              validate: (value: Date) => {
                if (moment().isSameOrAfter(value)) {
                  return 'Ngày kết thúc phải tính từ sau hôm nay';
                }
                if (moment(getValues('startTime')).isSameOrAfter(value)) {
                  return 'Ngày kết thúc phải sau ngày bắt đầu';
                }
              }
            }}
            render={({field, fieldState: { error }}) => (
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                required
                size="small"
                variant="dialog"
                format="dd/MM/yyyy"
                margin="dense"
                id="get-end-date"
                placeholder="Đến ngày"
                label="Ngày kết thúc"
                KeyboardButtonProps={{
                  "aria-label": "lr - keeper - change end date",
                }}
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Box>
      </MuiPickersUtilsProvider>
    </Container>
  );
};

export default UpdateLRKeeperRequest;