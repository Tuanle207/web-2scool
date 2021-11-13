import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    position: "relative",
    minHeight: "100%",
    padding: '20px 100px',
    borderRadius: 4,
    marginTop: 0,
    background: theme.palette.common.white,
  },
  emptyText: {
    textAlign: 'center'
  },
  utilBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }
}));

export default useStyles;