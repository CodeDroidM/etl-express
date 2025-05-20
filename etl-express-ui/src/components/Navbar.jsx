import React, { useState, useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Badge, 
  Tooltip,
  Divider
} from '@mui/material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import { PipelineContext } from '../App';
import NewPipelineDialog from './NewPipelineDialog';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPipeline } = useContext(PipelineContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const notifications = [
    { id: 1, message: "Pipeline 1 completed successfully", time: "10 min ago" },
    { id: 2, message: "Pipeline 2 failed with error code 500", time: "1 hour ago" },
    { id: 3, message: "New source system registered", time: "Yesterday" }
  ];

  const handleAddPipeline = () => {
    setOpenDialog(true);
  };

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleSavePipeline = (newPipeline) => {
    addPipeline(newPipeline);
    setOpenDialog(false);
    navigate('/pipelines');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.open('http://localhost:8080', '_blank')}
          >
            <AccountTreeIcon sx={{ mr: 1 }} />
            ETL Express
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/dashboard"
              startIcon={<DashboardIcon />}
              sx={{ 
                mx: 1,
                borderBottom: isActive('/dashboard') ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '3px'
              }}
            >
              Dashboard
            </Button>

            <Button 
              color="inherit" 
              component={NavLink} 
              to="/pipelines"
              startIcon={<AccountTreeIcon />}
              sx={{ 
                mx: 1,
                borderBottom: isActive('/pipelines') ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '3px'
              }}
            >
              Pipelines
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />

            <Tooltip title="Add new pipeline">
              <IconButton color="inherit" onClick={handleAddPipeline} size="small" sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleOpenNotifications} size="small" sx={{ ml: 1 }}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Help & Documentation">
              <IconButton color="inherit" size="small" sx={{ ml: 1 }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="User settings">
              <IconButton color="inherit" onClick={handleOpenUserMenu} size="small" sx={{ ml: 1 }}>
                <PersonIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => window.open('http://localhost:8080/?page_id=55', '_blank')}>My Account</MenuItem>
        <Divider />
        <MenuItem onClick={() => window.open('http://localhost:8080/?page_id=55', '_blank')}>Logout</MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleCloseNotifications}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            width: '300px',
            maxHeight: '400px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Notifications</Typography>
          <Button size="small">Mark all as read</Button>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleCloseNotifications} sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{notification.message}</Typography>
              <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleCloseNotifications} sx={{ justifyContent: 'center' }}>
          <Typography variant="button" color="primary">View All</Typography>
        </MenuItem>
      </Menu>

      {/* New Pipeline Dialog */}
      <NewPipelineDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSavePipeline}
      />
    </>
  );
};

export default Navbar;
