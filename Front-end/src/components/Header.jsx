import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Menu from '@mui/material/Menu';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from "../service/Context";
import { useNavigate } from "react-router-dom";



export default function Header( {showMenu, refresh, showPersonal, showSignUp, showUsersTable} ) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  let userRole = sessionStorage.getItem('userRole');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
        <AppBar position='static'>
            <Toolbar>
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
                        onClick={()=>{
                            handleClose();
                            showPersonal();
                            }}>
                            <ListItemIcon>
                                <SettingsIcon/>
                            </ListItemIcon>
                            Perfil</MenuItem>
                        {userRole === 'ADMIN' && (
                            <MenuItem
                            onClick={()=>{
                             handleClose();
                             showSignUp();
                            }}>
                                <ListItemIcon>
                                    <PersonAddAltIcon />
                                </ListItemIcon>
                                Añadir usuario
                            </MenuItem>
                        )}
                        {userRole === 'ADMIN' && (
                            <MenuItem
                            onClick={()=>{
                             handleClose();
                             showUsersTable();
                            }}>
                                <ListItemIcon>
                                    <SupervisorAccountIcon />
                                </ListItemIcon>
                                Mostrar usuarios
                            </MenuItem>
                        )}
                        <Divider/>
                        <MenuItem onClick={() => {
                            handleClose();
                            logout();
                            navigate('/')
                            }}>
                            <ListItemIcon>
                                <LogoutRoundedIcon/>
                            </ListItemIcon>
                        Cerrar sesión</MenuItem>
                    </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    </>
  );
}
