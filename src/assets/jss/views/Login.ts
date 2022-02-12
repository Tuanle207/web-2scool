import { makeStyles } from '@material-ui/core';
import bgImage from '../../img/login-bg.jpg';

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
    background: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'blue',
    filter: 'blur(0px)'
  },
  introContainer: {
    backdropFilter: 'blur(1px)',
  },
  loginContainer: {
    backdropFilter: 'blur(1px)',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 10
  }
}));

export default useStyles;