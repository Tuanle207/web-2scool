import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  imgContainer: {
    margin: theme.spacing(0, 8),
    marginTop: theme.spacing(1),
    width: 'auto', 
    position: 'relative',
    '& > img': {
      height: 300,
      width: 400,
      objectFit: 'cover'
    }
  },
  imgIcon: {
    position: 'absolute', 
    top: 10, 
    left: 10,
    zIndex: 1
  },
  formContainer: {
    display: 'flex',
    padding: theme.spacing(6, 8)
  }
}));

export default useStyles;