import { FC, memo, useState } from 'react';
import { AppBar, IconButton, Badge, Toolbar,
  InputBase, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { StyledMenu, StyledMenuItem } from './HeaderMenu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router';
import { AuthActions } from '../../store/actions';
import { routes } from '../../routers/routesDictionary';
import { useDebouncedCallback } from 'use-debounce/lib';
import useHeaderStyles from '../../assets/jss/components/Header/headerStyles';
import { useDispatch } from 'react-redux';

interface Props {
  hiddenSearchBar?: boolean;
  onTextChange?: (text: string) => void;
  searchBarPlaceholder?: string;
  pageName?: string;
}

const Header: FC<Props> = ({ 
  onTextChange, 
  hiddenSearchBar = false,
  searchBarPlaceholder = "Tìm kiếm...",
  pageName = "",
 }) => {

  const classes = useHeaderStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const onSearchChangeDebounced = useDebouncedCallback(
    (value: string) => onTextChange && onTextChange(value),
    200
  );

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    history.push(routes.Profile);
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    
    dispatch(AuthActions.postLogoutAsync())
    handleMobileMenuClose();
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
      <StyledMenuItem onClick={handleProfileClick}>
        <ListItemIcon className={classes.resetMenuIconWidth}>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Tài khoản của tôi" />
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
        <p>Thông báo</p>
      </MenuItem>
      <MenuItem onClick={handleProfileClick}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Tài khoản của tôi</p>
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <p>Đăng xuất</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar color='transparent' position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant='h5' display='inline'>{ pageName }</Typography>
            <div className={classes.search} style={hiddenSearchBar ? { visibility: 'hidden' } : {}} >
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                name="fcking-name"
                disabled={hiddenSearchBar ? true : false}
                placeholder={searchBarPlaceholder}
                fullWidth
                autoComplete="new-search"
                defaultValue=""
                type="search"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => onSearchChangeDebounced(e.target.value)}
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

export default memo(Header);