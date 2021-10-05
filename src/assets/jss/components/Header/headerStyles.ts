import { fade, makeStyles, Theme } from '@material-ui/core';

const useHeaderStyles = makeStyles((theme: Theme) => ({
  grow: {
    // flexGrow: 1
    width: '100%'
  },
  toolbar: {
    // padding: theme.spacing(2, 1)
    boxShadow: '0px 1px 4px #888888',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: '100px',
    backgroundColor: fade(theme.palette.grey[700], 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.grey[700], 0.25),
    },
    marginRight: 'auto',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20rem',
      '&:focus': {
        width: '30rem'
      }
    },
  },
  userMenu: {
    padding: theme.spacing(4)
  },
  userMenuItem: {
    padding: theme.spacing(1, 4)
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  resetMenuIconWidth: {
    minWidth: 0, 
    marginRight: 16
  }
}));

export default useHeaderStyles;