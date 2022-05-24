import { makeStyles } from '@material-ui/core'

const useSidebarStyles = makeStyles(theme => ({
  container: {
    background: '#363740',
    color: '#fff', 
    height: '100vh', 
    padding: 0,
    position: 'relative',
    flexBasis: 'auto',
    [theme.breakpoints.down('md')]: {
      flexBasis: 'auto',
      width: 'auto',
    }
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '2rem',
    '& > h1': {
      letterSpacing: 3,
      display: 'inline-block',
      marginTop: 4,
      marginLeft: 8,
      borderBottom: '4px solid transparent',
      cursor: 'pointer',
      transition: 'border 500ms', 
      userSelect: 'none',
      '&:hover': {
        borderBottom: `4px solid ${theme.palette.common.white}`,
      },
      [theme.breakpoints.down('md')]: {
        display: 'none',
      }
    },
    '& > button': {
      marginLeft: 'auto',
      [theme.breakpoints.down('md')]: {
        marginLeft: 0,
      }
    },
    
  },
  menuList: {
    flex: 1,
    
  },
  listItem: {
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent', 
    transition: 'background 500ms',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
    },
    '&.MuiListItem-root': {
      paddingTop: 6,
      paddingBottom: 6,
    },
    '& .MuiListItemText-root': {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      }
    },
    '& > svg': {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      }
    }
  },
  subListItem: {
    paddingLeft: 28,
    [theme.breakpoints.down('md')]: {
      paddingLeft: 16,
    }
  },
  listItemActive: {
    borderLeftColor: theme.palette.common.white,
    background: 'rgba(255,255,255,0.2)',
  },
  iconWrapper: {
    width: 32, 
    height: 32,
    marginRight: theme.spacing(1),
    fill: theme.palette.common.white,
    '& > svg': {
      width: 24,
      height: 24,
    },
    [theme.breakpoints.down('md')]: {
      marginRight: 0,
    }
  },
  listItemIcon: {
    color: '#fff'
  },
  listItemText: {
    fontSize: 6
  },
  copyRight: {
    position: 'relative',
    padding: theme.spacing(2, 0),
    '& > p': {
      color: theme.palette.grey[500],
      fontSize: 12,
      textAlign: 'center'
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    }
  },
  subMenuItem: {
    '& > *': {
      fontSize: 14
    }
  },
  divider: {
    height: 1,
    margin: theme.spacing(1, 2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.grey[500],
  }

}));

export default useSidebarStyles;