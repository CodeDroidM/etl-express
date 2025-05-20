import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Pipelines from './pages/Pipelines';
import Settings from './pages/Settings';
import './App.css';

// Create a context to share pipeline data across components
export const PipelineContext = createContext();

function App() {
  // Centralized state for pipelines that can be shared across components
  const [pipelines, setPipelines] = useState([
    { 
      id: 1, 
      name: 'Pipeline 1', 
      description: 'From MySQL to Redshift', 
      source: 'mysql', 
      destination: 'redshift', 
      lastRun: null, 
      runCount: 0, 
      load: 0,
      nodes: [
        { id: 'source-1', data: { label: 'MySQL Source' }, position: { x: 100, y: 50 } },
        { id: 'transform-1', data: { label: 'Transform SQL' }, position: { x: 300, y: 150 } },
        { id: 'destination-1', data: { label: 'Redshift' }, position: { x: 500, y: 250 } },
      ],
      edges: [
        { id: 'e1-2', source: 'source-1', target: 'transform-1' },
        { id: 'e2-3', source: 'transform-1', target: 'destination-1' },
      ]
    },
    { 
      id: 2, 
      name: 'Pipeline 2', 
      description: 'From CSV to BigQuery', 
      source: 'csv', 
      destination: 'bigquery', 
      lastRun: null, 
      runCount: 0, 
      load: 0,
      nodes: [
        { id: 'source-2', data: { label: 'CSV File' }, position: { x: 100, y: 50 } },
        { id: 'transform-2', data: { label: 'Data Cleansing' }, position: { x: 300, y: 150 } },
        { id: 'destination-2', data: { label: 'BigQuery' }, position: { x: 500, y: 250 } },
      ],
      edges: [
        { id: 'e1-2', source: 'source-2', target: 'transform-2' },
        { id: 'e2-3', source: 'transform-2', target: 'destination-2' },
      ]
    },
  ]);

  // Add a new pipeline
  const addPipeline = (newPipeline) => {
    const pipelineWithId = {
      id: pipelines.length ? Math.max(...pipelines.map(p => p.id)) + 1 : 1,
      lastRun: null,
      runCount: 0,
      load: 0,
      nodes: [
        { id: `source-${newPipeline.name}`, data: { label: `${newPipeline.source.toUpperCase()} Source` }, position: { x: 100, y: 50 } },
        { id: `transform-${newPipeline.name}`, data: { label: 'Transform' }, position: { x: 300, y: 150 } },
        { id: `destination-${newPipeline.name}`, data: { label: newPipeline.destination.toUpperCase() }, position: { x: 500, y: 250 } },
      ],
      edges: [
        { id: `e1-2-${newPipeline.name}`, source: `source-${newPipeline.name}`, target: `transform-${newPipeline.name}` },
        { id: `e2-3-${newPipeline.name}`, source: `transform-${newPipeline.name}`, target: `destination-${newPipeline.name}` },
      ],
      ...newPipeline
    };
    setPipelines([...pipelines, pipelineWithId]);
  };

  // Update an existing pipeline
  const updatePipeline = (id, updatedData) => {
    setPipelines(pipelines.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    ));
  };

  // Delete a pipeline
  const deletePipeline = (id) => {
    setPipelines(pipelines.filter(p => p.id !== id));
  };

  // Run a pipeline
  const runPipeline = (id) => {
    setPipelines(pipelines.map(p => 
      p.id === id ? { 
        ...p, 
        lastRun: new Date().toLocaleString(), 
        runCount: p.runCount + 1, 
        load: Math.floor(Math.random() * 100) 
      } : p
    ));
  };

  // Update nodes and edges for a specific pipeline
  const updatePipelineFlow = (id, nodes, edges) => {
    setPipelines(pipelines.map(p => 
      p.id === id ? { ...p, nodes, edges } : p
    ));
  };

  const pipelineContextValue = {
    pipelines,
    addPipeline,
    updatePipeline,
    deletePipeline,
    runPipeline,
    updatePipelineFlow
  };

  return (
    <PipelineContext.Provider value={pipelineContextValue}>
      <BrowserRouter>
        <Navbar />
        {/* Offset for the fixed navbar */}
        <div style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipelines" element={<Pipelines />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PipelineContext.Provider>
  );
}

export default App;