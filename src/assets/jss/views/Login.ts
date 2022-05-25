import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%', 
    height: '100%', 
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  wrapper: {
    height: '100%',
    position: 'relative'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(https://reviewedu.net/wp-content/uploads/2021/09/2232cb90-60aa-43e9-9357-c7ec51f4d82b.jpeg)`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    // backgroundColor: '#fff',
    // filter: 'blur(0px)'
  },
  form: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
  },
  introContainer: {
    backdropFilter: 'blur(1px)',
    backgroundColor: 'rgba(38, 125, 255, 0.7)',
  },
  loginContainer: {
    backdropFilter: 'blur(1px)',
    backgroundColor: 'rgba(255, 250, 250, 0.9)',
  }
}));

export default useStyles;