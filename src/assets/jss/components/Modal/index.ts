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
    padding: theme.spacing(2, 3),
    minWidth: 400
  },
  titleBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  warning: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.main}`,
    padding: '8px 4px',
    borderRadius: 4
  }
}

export default modalStyles;