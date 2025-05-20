import React, { useState } from 'react';
import { TextField, Switch, FormControlLabel, Button, Paper, Typography } from '@mui/material';

const Settings = () => {
  const [displayName, setDisplayName] = useState('User');
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    console.log('Settings saved:', { displayName, darkMode });
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 400, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <TextField
        label="Display Name"
        fullWidth
        margin="normal"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
        label="Dark Mode"
      />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Paper>
  );
};

export default Settings;
