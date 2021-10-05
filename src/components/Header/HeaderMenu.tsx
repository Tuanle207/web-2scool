import React from 'react';
import { Menu, MenuItem, withStyles, MenuProps } from '@material-ui/core';

const StyledMenu = withStyles((theme) => ({
  paper: {
    border: '1px solid #d3d4d5',
    padding: theme.spacing(2, 0),
  },
}))((props: MenuProps) => (
  <Menu
    elevation={0}
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
    padding: theme.spacing(1, 4),
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