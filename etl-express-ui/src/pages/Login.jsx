import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [cred, setCred] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(cred.username, cred.password);
  };

  return (
    <Paper sx={{ padding: 2, maxWidth: 300, margin: '100px auto' }}>
      <Typography variant="h6">Sign In</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={cred.username}
          onChange={(e) => setCred({ ...cred, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={cred.password}
          onChange={(e) => setCred({ ...cred, password: e.target.value })}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
