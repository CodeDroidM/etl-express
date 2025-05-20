import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import JobDialog from '../components/JobDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Scheduler = () => {
  // Mocked list of jobs; each job corresponds to a pipeline job.
  const [jobs, setJobs] = useState([
    { id: 1, name: 'Job 1', pipeline: 'Pipeline 1', lastRun: null, runCount: 0, load: 0 },
    { id: 2, name: 'Job 2', pipeline: 'Pipeline 2', lastRun: null, runCount: 0, load: 0 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Open dialog for a new job.
  const handleAddJob = () => {
    setEditingJob(null);
    setOpenDialog(true);
  };

  // Open dialog for editing a job.
  const handleEditJob = (job) => {
    setEditingJob(job);
    setOpenDialog(true);
  };

  // Delete job from list.
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Simulate running a job: update the last run time, increment runCount, and update load.
  const handleRunJob = (id) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id
          ? {
              ...job,
              lastRun: new Date().toLocaleString(),
              runCount: job.runCount + 1,
              load: Math.floor(Math.random() * 100),
            }
          : job
      )
    );
  };

  // Save changes from the job dialog.
  const handleDialogSave = (jobData) => {
    if (editingJob) {
      // Update an existing job.
      setJobs(jobs.map((job) => (job.id === editingJob.id ? { ...job, ...jobData } : job)));
    } else {
      // Add a new job.
      const newJob = {
        id: jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1,
        lastRun: null,
        runCount: 0,
        load: 0,
        ...jobData,
      };
      setJobs([...jobs, newJob]);
    }
    setOpenDialog(false);
  };

  // Prepare chart data based on the jobs metrics.
  const chartData = jobs.map((job) => ({
    name: job.name,
    runCount: job.runCount,
    load: job.load,
  }));

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Scheduler & Job Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddJob} sx={{ mb: 2 }}>
        Add New Job
      </Button>
      <Paper sx={{ mb: 3, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Jobs List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Name</TableCell>
                <TableCell>Pipeline</TableCell>
                <TableCell>Last Run</TableCell>
                <TableCell>Run Count</TableCell>
                <TableCell>Load</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{job.pipeline}</TableCell>
                  <TableCell>{job.lastRun || 'Never'}</TableCell>
                  <TableCell>{job.runCount}</TableCell>
                  <TableCell>{job.load}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleRunJob(job.id)} color="primary">
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditJob(job)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteJob(job.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Job Run Count</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="runCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Job Load</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="load" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <JobDialog open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleDialogSave} job={editingJob} />
    </Box>
  );
};

export default Scheduler;
