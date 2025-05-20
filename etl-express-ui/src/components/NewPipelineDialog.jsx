import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const sourceSystems = ['mysql', 'postgres', 'mongodb', 'csv', 'api'];
const destinationSystems = ['redshift', 'bigquery', 'snowflake', 'postgres', 'file'];

const NewPipelineDialog = ({ open, onClose, onSave, pipeline }) => {
  const [pipelineData, setPipelineData] = useState({
    name: '',
    description: '',
    source: 'mysql',
    destination: 'redshift',
  });

  // If we're editing an existing pipeline, load its data
  useEffect(() => {
    if (pipeline) {
      setPipelineData({
        name: pipeline.name,
        description: pipeline.description,
        source: pipeline.source,
        destination: pipeline.destination,
      });
    } else {
      // Reset form when creating a new pipeline
      setPipelineData({
        name: '',
        description: '',
        source: 'mysql',
        destination: 'redshift',
      });
    }
  }, [pipeline, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPipelineData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!pipelineData.name) {
      return; // Don't submit if name is empty
    }
    
    onSave(pipelineData);
    
    // Reset form after submission
    if (!pipeline) {
      setPipelineData({
        name: '',
        description: '',
        source: 'mysql',
        destination: 'redshift',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pipeline ? 'Edit Pipeline' : 'Create New Pipeline'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pipeline Name"
              name="name"
              value={pipelineData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={pipelineData.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Source System</InputLabel>
              <Select
                name="source"
                value={pipelineData.source}
                onChange={handleChange}
                label="Source System"
              >
                {sourceSystems.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Destination System</InputLabel>
              <Select
                name="destination"
                value={pipelineData.destination}
                onChange={handleChange}
                label="Destination System"
              >
                {destinationSystems.map((dest) => (
                  <MenuItem key={dest} value={dest}>
                    {dest.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {pipeline ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPipelineDialog;