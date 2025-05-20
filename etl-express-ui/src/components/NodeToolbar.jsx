import React from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, ClickAwayListener } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

const NodeToolbar = ({ position, onClose, onDelete, onEdit, onConnect }) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Paper
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          width: 200,
        }}
      >
        <MenuList>
          <MenuItem onClick={() => { onEdit && onEdit(); onClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Properties</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onConnect && onConnect(); onClose(); }}>
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create Connection</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onDelete && onDelete(); onClose(); }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Node</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </ClickAwayListener>
  );
};

export default NodeToolbar;