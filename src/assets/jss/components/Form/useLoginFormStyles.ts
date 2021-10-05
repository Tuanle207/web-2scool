import appColor from '../../../themes/appColor';
import { makeStyles } from '@material-ui/core';

const useLoginFormStyles = makeStyles(theme => ({
  formContainer: {
    height: '50rem',
    background: theme.palette.common.white,
    padding: theme.spacing(10, 4),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textShadow: '10px',
    letterSpacing: '2px',
    maxWidth: '25rem',
  },
  textField: {
    width: '25rem',
    margin: '1rem',
  },
  checkBox: {
    width: '25rem',
  },
  button: {
    width: '25rem',
    margin: theme.spacing(2),
    padding: theme.spacing(1, 0),
    alignSelf: 'center',
    color: appColor.white,

    '&:hover': {
      transform: 'scale(1.01, 1.01)'
    },
  }
}));

export default useLoginFormStyles;