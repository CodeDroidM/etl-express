import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left" PaperProps={{ style: { width: 240 } }}>
      <List>
        <ListItemButton component={NavLink} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/pipelines">
          <ListItemText primary="Pipelines" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/settings">
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
