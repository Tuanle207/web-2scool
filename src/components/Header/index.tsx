import React from 'react';
import { AppBar, IconButton, Badge, Toolbar, InputBase, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import useHeaderStyles from '../../assets/jss/components/Header/headerStyles';
import { withRedux } from '../../common/utils/ReduxConnect';
import { AuthActions } from '../../common/store/actions';
import { StyledMenu, StyledMenuItem } from './HeaderMenu';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router';

interface Props {
  hiddenSearchBar?: boolean;
  onTextChange?: (text: string) => void;
  postlogoutAsync: () => void;
  
}

const Header: React.FC<Props> = ({ postlogoutAsync, onTextChange, hiddenSearchBar = false }) => {

  const classes = useHeaderStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    postlogoutAsync();
    handleMobileMenuClose();
  };

  const handleAdminClick = () => {
    setAnchorEl(null);
    history.push('/admin/courses');
    setAnchorEl(null);
  }

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const textChange = (e: any) => {
    const value = e.target!.value || '';
    // setSearchText(value);
    onTextChange && onTextChange(value);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <StyledMenu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={isMenuOpen}
      onBackdropClick={() => setAnchorEl(null)}
      >
      <StyledMenuItem>
        <ListItemIcon className={classes.resetMenuIconWidth}>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Tài khoản của tôi" />
      </StyledMenuItem>
      <StyledMenuItem onClick={handleAdminClick}>
        <ListItemIcon className={classes.resetMenuIconWidth}>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Tới trang quản trị" />
      </StyledMenuItem>
      <StyledMenuItem onClick={handleLogoutClick}>
        <ListItemIcon className={classes.resetMenuIconWidth}>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </StyledMenuItem>
    </StyledMenu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar color='transparent' position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.search} style={hiddenSearchBar ? { visibility: 'hidden' } : {}} >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              disabled={hiddenSearchBar ? true : false}
              placeholder="Tìm kiếm…"
              fullWidth
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={textChange}
            />
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  )
};

export default withRedux<Props>({
  component: React.memo(Header),
  dispatchProps: ({
    postlogoutAsync: AuthActions.postLogoutAsync
  })
});