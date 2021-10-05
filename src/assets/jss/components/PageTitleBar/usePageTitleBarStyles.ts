import { makeStyles, Theme } from '@material-ui/core';

const usePageTitleBarStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1, 8),
    backgroundColor: '#e8e8e8',
    borderBottom: '1px solid #8888',
  },
  title: {
  
  },
  button: {
    // padding: theme.spacing(1, 2)
    textTransform: 'none'
  },
  buttonMoreOptions: {
    backgroundColor: '#EEF2F5',
    marginRight: theme.spacing(1.25)
  },
}));

export default usePageTitleBarStyles;