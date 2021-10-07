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
  },
  cardContainer: {
    flex: 1,
    border: `1px solid ${theme.palette.grey.A700}`,
    padding: theme.spacing(2, 4),
    position: 'relative'
  },
  imgContainer: {
    margin: theme.spacing(2, 0),
    width: 'auto', 
    position: 'relative',
    '& > img': {
      height: 300,
      width: 400,
      cursor: 'pointer',
      '&:hover': {
        animation: 'all 10s',
        transform: 'scale(1.1, 1.05)'
      }
    }
  },
  imgIcon: {
    position: 'absolute', 
    top: 10, 
    left: 10,
    zIndex: 1
  },
  settingBtn: {
    position: 'absolute',
    top: 0,
    right: 0
  }
}));

export default useStyles;