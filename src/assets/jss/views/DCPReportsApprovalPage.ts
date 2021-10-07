import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    // overflowY: 'scroll'
    padding: '20px 100px' 
  },
  emptyText: {
    color: theme.palette.grey[500],
    textAlign: 'center'
  }
}));

export default useStyles;