import { makeStyles } from '@material-ui/core'
import logoBg from '../../../img/logo-bg.jpg';

const useSidebarStyles = makeStyles(theme => ({
  container: {
    background: '#363740',
    color: '#fff', 
    minHeight: '100vh', 
    padding: 0,
    position: 'relative',
    backdropFilter: 'blur(1px)'
  },
  filterBackground: {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: `url(${logoBg})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(8px)'
  },
  titleWrapper: {
    padding: '3rem 4rem',
    backdropFilter: 'blur(1px)',
    '& > h1': {
      letterSpacing: 3,
      display: 'inline-block',
      borderBottom: '4px solid transparent',
      cursor: 'pointer',
      transition: 'border 500ms', 
      userSelect: 'none',
      '&:hover': {
        borderBottom: `4px solid ${theme.palette.primary.main}`,
      },
    }
  },
  listItem: {
    padding: '1rem 2rem',
    transition: 'background 500ms', 
    '&:hover': {
      background: 'rgba(0,0,0,0.25)',
    },
  },
  listItemActive: {
    background: 'rgba(0,0,0,0.8)'
  },
  listItemIcon: {
    color: '#fff'
  },
  listItemText: {
    fontSize: 6
  },
  copyRight: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    '& > p': {
      color: theme.palette.grey[500],
      fontSize: 12,
      textAlign: 'center'
    }
  },
  subMenuItem: {
    '& > *': {
      fontSize: 14
    }
  }

}));

export default useSidebarStyles;