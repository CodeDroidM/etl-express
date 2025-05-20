import React, { useContext } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Card, CardContent
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { PipelineContext } from '../App';
import NewPipelineDialog from '../components/NewPipelineDialog';

const Dashboard = () => {
  const { pipelines, addPipeline, updatePipeline, deletePipeline, runPipeline } = useContext(PipelineContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingPipeline, setEditingPipeline] = React.useState(null);
  const navigate = useNavigate();

  const totalLoad = pipelines.reduce((total, p) => total + (p.load || 0), 0);
  const avgLoad = pipelines.length > 0 ? Math.round(totalLoad / pipelines.length) : 0;
  const totalRunCount = pipelines.reduce((sum, p) => sum + (p.runCount || 0), 0);

  const chartData = pipelines.map((p) => ({
    name: p.name,
    runCount: p.runCount,
    load: p.load,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
        <span style={{ color: '#7C4DFF' }}>ETL Express:</span> Dashboard & Metrics
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #7C4DFF', borderRadius: 2, boxShadow: '0 0 10px #7C4DFF40' }}>
            <CardContent>
              <Typography variant="h6">Total Pipelines</Typography>
              <Typography variant="h3">{pipelines.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #7C4DFF', borderRadius: 2, boxShadow: '0 0 10px #7C4DFF40' }}>
            <CardContent>
              <Typography variant="h6">Total Runs</Typography>
              <Typography variant="h3">{totalRunCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #7C4DFF', borderRadius: 2, boxShadow: '0 0 10px #7C4DFF40' }}>
            <CardContent>
              <Typography variant="h6">Avg Load</Typography>
              <Typography variant="h3">{avgLoad}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ background: 'linear-gradient(to right, #ff4081, #7C4DFF)', mr: 2, mb: 2 }}
        onClick={() => { setOpenDialog(true); setEditingPipeline(null); }}
      >
        Add New Pipeline
      </Button>

      <Button variant="outlined" color="secondary" onClick={() => navigate('/pipelines')} sx={{ mb: 2 }}>
        Pipeline Builder
      </Button>

      {/* Pipeline Table */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Pipeline Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pipeline</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Last Run</TableCell>
                <TableCell>Run Count</TableCell>
                <TableCell>Load</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelines.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.source?.toUpperCase()}</TableCell>
                  <TableCell>{p.destination?.toUpperCase()}</TableCell>
                  <TableCell>{p.lastRun || 'Never'}</TableCell>
                  <TableCell>{p.runCount}</TableCell>
                  <TableCell>{p.load}%</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => runPipeline(p.id)} color="primary"><PlayArrowIcon /></IconButton>
                    <IconButton onClick={() => { setOpenDialog(true); setEditingPipeline(p); }} color="primary"><EditIcon /></IconButton>
                    <IconButton onClick={() => deletePipeline(p.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pipeline Run Count</Typography>
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pipeline Load</Typography>
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

      <NewPipelineDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onSave={(data) => {
          if (editingPipeline) updatePipeline(editingPipeline.id, data);
          else addPipeline(data);
          setOpenDialog(false);
        }} 
        pipeline={editingPipeline} 
      />
    </Box>
  );
};

export default Dashboard;
