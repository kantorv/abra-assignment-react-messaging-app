import { useState, useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import AppBar from './AppBar'
import ComposeMessageCard from './ComposeMessageCard'
import { Outlet, useOutletContext } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import type { ApiMachineActorType } from '../../service/api/apimachine';
import { useAuthContext } from '../../service/auth/useAuthContext';
import { useSelector, useActor } from '@xstate/react';
import Paper from '@mui/material/Paper';


const drawerWidth = 240;

export default function PermanentDrawerLeft() {

  const location = useLocation()
  const navigate = useNavigate()

  const { authService } = useAuthContext()

  const apiService = useSelector(authService, (state) => state.children.api)  as ApiMachineActorType
  const [apiState] = useActor(apiService)
 

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          // zIndex:10000, 
          // width: "100%",
          // over
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px` 
        
        }}
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

          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith('/messages') || location.pathname === "/" ? true : false}
              onClick={() => navigate("/")}
            >
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary={"Inbox"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
             selected={location.pathname.startsWith('/sent')}
             onClick={() => navigate("/sent")}
            >
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={"Sent"} />
            </ListItemButton>
          </ListItem>


          <ListItem disablePadding>
            <ListItemButton disabled>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary={"Starred"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
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

        <div style={{ flexGrow: 1 }}></div>
        <Box
          sx={{
            display: "flex",
            pb: 2,
            justifyContent: "center"
          }}
        >


          <Button
            sx={{ ml: 1, mr: 1, pt: 2, pb: 2, pl: 4, pr: 4, borderRadius: 4 }}
            variant="contained"
            startIcon={<EditIcon sx={{ mr: 2 }} />}
            onClick={() => apiService.send('EVENTS.API.CREATE_MESSAGE')}
            disabled={apiState.matches('post_message')}
          // fullWidth
          >
            Compose
          </Button>


        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet context={{ apiService }} />

        {apiState.matches('post_message') ?
          <Box
            sx={{
              position: "fixed",
              bottom: 10,
              right: 10
            }}
          >
            <Paper elevation={5}>
              <ComposeMessageCard 
                apiService={apiService}
              />
            </Paper>

          </Box> :
          null}
      </Box>
    </Box>
  );
}

export function useApiService(){
  return useOutletContext<{apiService:ApiMachineActorType }>()
}
