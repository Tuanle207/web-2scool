import { useState, useEffect } from 'react';
import { Container, Radio, RadioGroup, RadioProps, makeStyles, FormControlLabel, TextField} from '@material-ui/core';
import { Identity } from '../../interfaces';
import { IdentityService } from '../../api';
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

const UpdateLRKeeperRequest = ({
  classId,
  assignedStudentId,
}: {
  classId: string;
  assignedStudentId?: string;
}) => {

  const [ students, setStudents ] = useState<Identity.UserForTaskAssignmentDto[]>([]);
  const [ selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [ studentName, setStudentName ] = useState<string>('');
  const [ loadingData, setLoadingData ] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const { items } = await IdentityService.getUsersForTaskAssignment(classId);
      setStudents(items);
      const assignee = items.find((x) => x.userProfileId === assignedStudentId);
      console.log({items, assignee, assignedStudentId});
      setSelectedUserId(assignee ? assignee.userProfileId : null);
      setLoadingData(false);
    };

    initData();

  }, [classId, assignedStudentId]);

  useEffect(() => {
    console.log({selectedUserId});
    if (selectedUserId)  {
      ActionModal.setData({ 
        data: {
          classId: classId,
          userId: selectedUserId
        },
        error: undefined
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log((event.target as HTMLInputElement).value);
    setSelectedUserId((event.target as HTMLInputElement).value);
  };

  return (
    <form style={{padding: '20px 0', paddingTop: 8, width: "100%"}}>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm học sinh"
        size="small"
        fullWidth
        style={{ marginBottom: 24 }}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <Container style={{ height: 180, overflowY: "auto" }}>
        {
          loadingData ? (
            <p>Đang tải dữ liệu ...</p>
          ) : (
            <RadioGroup
              defaultValue={assignedStudentId} 
              value={selectedUserId} 
              onChange={handleRadioChange}
            >
              {
                students.filter(item => withoutVNSign(item.name).toLowerCase().includes(studentName))
                  .map((item) =>  (
                  <FormControlLabel
                    key={item.id}
                    value={item.userProfileId} 
                    control={<StyledRadio />} 
                    label={item.name}
                  />
                ))
              }
            </RadioGroup> 
          )
        }
      </Container>
    </form>
  );
};

export default UpdateLRKeeperRequest;