import { makeStyles, Theme } from '@material-ui/core';

const useFilterButtonStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
  },
  button: {
    // reset css
    border: 0,
    margin: 0,
    width: "auto",
    overflow: "visible",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    lineHeight: "normal",
    fontSmooth: "inherit",
    WebkitFontSmoothing: "inherit",
    MozOsxFontSmoothing: "inherit",
    WebkitAppearance: "none",

    // custom style
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    cursor: "pointer",
    "&:focus-visible": {
      outline: "none"
    }
  },
  buttonActive: {
    borderColor: theme.palette.primary.main,
  },
  text: {

  },
  optionsBox: {
    display: "flex",
    flexDirection: "column",
    height: 0,
    // width: 200,
    maxHeight: 400,
    minWidth: 600,
    visibility: "hidden",
    opacity: 0,
    position: "absolute",
    left: 0,
    bottom: 0, 
    transform: "translateY(calc(100% + 10px))",
    zIndex: 200,
    padding: theme.spacing(1),
    background: theme.palette.common.white,
    borderRadius: 4,
    boxShadow: `0 2px 16px ${theme.palette.grey[700]}`,
    transition: "visibility 0s, opacity 0.25s ease-in-out",
    "&::before": {
      content: '""',
      height: 16,
      width: 16,
      position: "absolute",
      backgroundColor: theme.palette.common.white,
      top: -5,
      left: 30,
      transform: "rotate(45deg)",
    }
  },
  optionsBoxActive: {
    height: "auto",
    visibility: "visible",
    opacity: 1,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
  options: {
    padding: theme.spacing(1),
    overflowY: 'auto',
  },
  option: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

export default useFilterButtonStyles;