import { makeStyles, Theme } from '@material-ui/core';

const usePageTitleBarStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1, 4),
    height: 54,
    '& .MuiGrid-container':  {
      width: 'auto',
    }
  },
  title: {
    userSelect: 'none',
  },
  button: {
    // textTransform: 'none'
  },
  buttonMoreOptions: {
    backgroundColor: '#EEF2F5',
    marginRight: theme.spacing(1.25)
  },
  filter: {
    display: "flex",
    flexDirection: "row",
    "& > *": {
      margin: theme.spacing(0, 1)
    }
  }
}));

export default usePageTitleBarStyles;