import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useAuth } from "../Service/AuthContext";
import { useNavigate } from "react-router-dom";



export default function Header( {showMenu, refresh} ) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
        <AppBar position='static'>
            <Toolbar>
                {auth && (
                    <div>
                <IconButton
                size="medium"
                edge="start"
                color="inherit"
                aria-label="menu"
                title='menu'
                sx={{ mr: 2 }}
                onClick={showMenu}
            >
                <MenuIcon />
            </IconButton>
            </div>
                )}
                <Typography
                    variant='h6'
                    component='a'
                    href="/"
                    sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        letterSpacing: '.2rem',
                        flexGrow: 1}}
                >
                    Remitente
                </Typography>
                 {auth && (
                    <div>
                    <IconButton
                        color="inherit"
                        title='Refresh'
                        size="medium"
                        onClick={refresh}
                    >
                        <RefreshRoundedIcon/>
                    </IconButton>
                    <IconButton
                        size="medium"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        title='profil'
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem 
                        onClick={handleClose}>
                            <ListItemIcon>
                                <AccountCircleRoundedIcon/>
                            </ListItemIcon>
                        Profile</MenuItem>
                        <MenuItem onClick={() => {
                            handleClose;
                            logout();
                            navigate('/');
                            }}>
                            <ListItemIcon>
                                <LogoutRoundedIcon/>
                            </ListItemIcon>
                        Logout</MenuItem>
                    </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
  );
}
