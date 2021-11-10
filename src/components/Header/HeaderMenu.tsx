import { Menu, MenuItem, withStyles, MenuProps } from '@material-ui/core';

const StyledMenu = withStyles((theme) => ({
  paper: {
    overflow: "visible",
    border: "1px solid #d3d4d5",
    "&::before": {
      content: '""',
      height: 16,
      width: 16,
      position: "absolute",
      backgroundColor: theme.palette.common.white,
      top: -8,
      right: 20,
      zIndex: 0,
      transform: "rotate(45deg)",
      border: "1px solid #d3d4d5",
      borderBottom: "none",
      borderRight: "none"
    }
  },
}))((props: MenuProps) => (
  <Menu
    elevation={3}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: theme.spacing(.5, 2),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export {
  StyledMenu,
  StyledMenuItem
};