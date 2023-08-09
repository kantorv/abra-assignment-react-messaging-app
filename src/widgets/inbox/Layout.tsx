import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';

import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SendIcon from '@mui/icons-material/Send';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DraftsIcon from '@mui/icons-material/Drafts';

import AppBar from './AppBar'
import { Outlet } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {

  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(()=>{

    console.log("location update", location)
  },[location])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>

            <ListItem  disablePadding>
              <ListItemButton 
                  selected={location.pathname.startsWith('/messages') ||location.pathname==="/"?true:false}
                  onClick={()=>navigate("/")}
                  >
                <ListItemIcon>
                  <MailIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Inbox"} />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SendIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Sent"} />
              </ListItemButton>
            </ListItem>


            <ListItem  disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  <StarBorderIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Starred"} />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  <DraftsIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Drafts"} />
              </ListItemButton>
            </ListItem>



        </List>
        <Divider />

        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton disabled>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
