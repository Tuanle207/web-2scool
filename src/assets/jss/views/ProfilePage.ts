import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabContainer: {
    flex: 1,
    padding: theme.spacing(8, 4)
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-wrapper': {
      alignItems: 'flex-start',
    },
    '& .Mui-selected': {
      color: theme.palette.primary.light
    }
  },
  tabView: {
    flex: 1,
    padding: theme.spacing(0, 4)
  },
  userPhoto: {
    height: 200,
    width: 200,
    userSelect: 'none',
  }
}));

export default useStyles;