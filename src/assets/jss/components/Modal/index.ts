import { theme } from '../../../themes/theme';
import { CSSProperties } from 'react';


const modalStyles: {[key: string]: CSSProperties} = {
  root: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    // minWidth: 400,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey.A700}`,
    padding: theme.spacing(1, 2)
  },
  titleBar: {
    borderBottom: `1px solid ${theme.palette.grey.A400}`
  },
  buttonAccept: {
    marginLeft: theme.spacing(2)
  },
  buttonGroup: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  }
}

export default modalStyles;