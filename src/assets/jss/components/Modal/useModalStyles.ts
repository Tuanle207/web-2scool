import { makeStyles, Theme } from '@material-ui/core';


const useModalStyles = makeStyles((theme: Theme) => ({
  root: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    // minWidth: 400,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey.A700}`,
    padding: theme.spacing(2, 3),
    minWidth: 400
  },
  titleBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  warning: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: theme.spacing(2),
    color: theme.palette.warning.dark
  }
}));

export default useModalStyles;