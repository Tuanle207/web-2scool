import { makeStyles } from '@material-ui/core';

const useIntroFormStyles = makeStyles(theme => ({
  formContainer: {
    height: '50rem',
    width: '50rem',
    background: '#267dff',
    padding: theme.spacing(2, 4),
    color: '#fff',
    borderColor: theme.palette.grey.A200,
    '& > *':  {
      userSelect: 'none',
    }
  },
  wrapper: {
    height: '100%',
    widht: '100%',
    padding: theme.spacing(0, 2)
  },
  button: {
    color: '#fff',
    borderColor: '#fff',
    borderRadius: 50,
    padding: '10px 20px',
    '&:hover': {
      borderColor: '#fff',
    }
  },
  welcome: {
    borderBottom: '3px solid #fff',
  },
  welcomeText: {
    display: 'inline-block',
  },
  descriptionText: {
    fontWeight: 300,
    margin: theme.spacing(3, 0),
    lineHeight: 1.6,
  }
}));

export default useIntroFormStyles