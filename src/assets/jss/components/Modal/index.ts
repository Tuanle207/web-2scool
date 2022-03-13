import { CSSProperties } from 'react';
import { theme } from '../../../themes/theme';

const modalStyles: {[key: string]: CSSProperties} = {
  root: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey.A700}`,
    padding: theme.spacing(2, 3),
    minWidth: 400,
  },
  titleBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 2),
  },
  borderTop:{
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  content: {
    maxHeight: 400,
    overflowY: 'auto',
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