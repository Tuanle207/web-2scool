import { makeStyles } from '@material-ui/core'

const useContactCardStyles = makeStyles(theme => ({
  container: {
   
  },
  
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  basicInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
  },
  basicInfoTextRow: {
    marginBottom: 0,
  },
  basicInfoText: {
    marginLeft: theme.spacing(1.5),
  },
  name: {
    fontWeight: 700,
  },
  position: {
    fontWeight: 300,
    fontSize: 12,
  },
  contact: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
  },
  contactRowInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontWeight: 500,
    '& > svg': {
      marginTop: -4,
      marginRight: theme.spacing(1),
    },
    '& > span': {
      fontWeight: 400,
    }
  }
}));

export default useContactCardStyles;