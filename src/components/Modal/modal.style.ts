import { makeStyles } from '@material-ui/core';

const useModalStyles = makeStyles((theme) => ({
  root: {

  },
  field: {
    "&:not(:last-child)": {
      marginBottom: theme.spacing(2),
    }
  },
}));

export default useModalStyles;