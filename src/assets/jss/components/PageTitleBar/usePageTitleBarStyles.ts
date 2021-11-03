import { makeStyles, Theme } from '@material-ui/core';

const usePageTitleBarStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1, 4),
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
}));

export default usePageTitleBarStyles;