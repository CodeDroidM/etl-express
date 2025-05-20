import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const EdgeToolbar = ({ position, selectedEdge, onDelete, onClose }) => {
  return (
    <Menu
      open={Boolean(selectedEdge)}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      onClose={onClose}
    >
      <MenuItem onClick={onDelete}>Delete Edge</MenuItem>
    </Menu>
  );
};

export default EdgeToolbar;
