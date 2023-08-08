import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';

import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';


import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import Badge from '@mui/material/Badge';

import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useAuthContext } from '../../service/auth/useAuthContext';



import {
  useNavigate
} from "react-router-dom"; 
 

function ResponsiveAppBar(props:any) {
  const navigate = useNavigate() 
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
 
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const {authService} = useAuthContext()

  const logoutFn = ()=>authService.send('EVENTS.USER.LOGOUT')


  return (
    <AppBar {...props} >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <SendIcon sx={{ display:  'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
          //  href="/"
            onClick={()=>navigate("/")}
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor:"pointer"
            }}
          >
             Messaging App
          </Typography>

  

          <Box sx={{ flexGrow: 1  }}></Box>

  
          <Box sx={{ display:  'flex' , pr:1 }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
 
          </Box> 

          <Box sx={{ flexGrow: 0, }}>
            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon     sx={{ color: "#fff",fontSize:40 }}  />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
             
             <MenuItem onClick={logoutFn}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
            </Menu>
          </Box>
         

          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
