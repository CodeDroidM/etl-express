import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const pipelineOptions = [
  { value: 'Pipeline 1', label: 'Pipeline 1' },
  { value: 'Pipeline 2', label: 'Pipeline 2' },
  { value: 'Pipeline 3', label: 'Pipeline 3' },
];

const JobDialog = ({ open, onClose, onSave, job }) => {
  const [jobData, setJobData] = useState({
    name: '',
    pipeline: '',
  });

  useEffect(() => {
    if (job) {
      setJobData({ name: job.name, pipeline: job.pipeline });
    } else {
      setJobData({ name: '', pipeline: '' });
    }
  }, [job]);

  const handleChange = (field) => (e) => {
    setJobData({ ...jobData, [field]: e.target.value });
  };

  const handleSave = () => {
    onSave(jobData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{job ? 'Edit Job' : 'Add New Job'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Job Name"
          fullWidth
          value={jobData.name}
          onChange={handleChange('name')}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Pipeline</InputLabel>
          <Select value={jobData.pipeline} label="Pipeline" onChange={handleChange('pipeline')}>
            {pipelineOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobDialog;
