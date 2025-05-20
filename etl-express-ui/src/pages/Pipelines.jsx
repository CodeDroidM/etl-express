import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper,
  IconButton
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import debounce from 'lodash/debounce';

import { PipelineContext } from '../App';
import NewPipelineDialog from '../components/NewPipelineDialog';
import NodeToolbar from '../components/NodeToolbar';
import NodeConfigModal from '../components/NodeConfigModal';
import EdgeToolbar from '../components/EdgeToolbar';

// Custom hook to suppress ResizeObserver errors
function useResizeObserverFix() {
  useEffect(() => {
    const originalErrorHandler = window.onerror;
    function errorHandler(message, source, lineno, colno, error) {
      if (
        message.includes('ResizeObserver loop') || 
        (error && error.message && error.message.includes('ResizeObserver loop'))
      ) {
        return true; // Suppress ResizeObserver errors
      }
      if (originalErrorHandler) {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    }
    window.onerror = errorHandler;
    return () => {
      window.onerror = originalErrorHandler;
    };
  }, []);
}

// Define toolbox node types (for the left toolbox)
const toolboxTypes = {
  source: {
    typeLabel: 'Source',
    options: ['mysql', 'postgres', 'mongodb', 'csv', 'api']
  },
  transform: {
    typeLabel: 'Transform',
    options: ['filter', 'join', 'aggregate', 'sort', 'clean']
  },
  destination: {
    typeLabel: 'Destination',
    options: ['redshift', 'bigquery', 'snowflake', 'postgres', 'file']
  },
};

const Pipelines = () => {
  useResizeObserverFix();
  
  const { pipelines, addPipeline, runPipeline, updatePipelineFlow } = useContext(PipelineContext);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  
  // For right-click context menu for nodes:
  const [selectedNode, setSelectedNode] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showNodeToolbar, setShowNodeToolbar] = useState(false);
  
  // For node configuration modal:
  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState(null);
  
  // For right-click context menu for edges:
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeToolbarPosition, setEdgeToolbarPosition] = useState({ x: 0, y: 0 });
  const [showEdgeToolbar, setShowEdgeToolbar] = useState(false);
  
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  
  // Load selected pipeline's nodes/edges from context
  useEffect(() => {
    if (selectedPipeline) {
      const updatedPipeline = pipelines.find(p => p.id === selectedPipeline.id);
      if (updatedPipeline) {
        setSelectedPipeline(updatedPipeline);
        setNodes(updatedPipeline.nodes || []);
        setEdges(updatedPipeline.edges || []);
      }
    } else if (pipelines.length > 0) {
      setSelectedPipeline(pipelines[0]);
    }
  }, [pipelines, selectedPipeline]);
  
  // Slight delay to ensure ReactFlow is ready
  useEffect(() => {
    if (selectedPipeline) {
      const timer = setTimeout(() => {
        setNodes(selectedPipeline.nodes || []);
        setEdges(selectedPipeline.edges || []);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [selectedPipeline]);
  
  // Debounced update to context
  const debouncedUpdateFlow = useCallback(
    debounce((id, updatedNodes, updatedEdges) => {
      updatePipelineFlow(id, updatedNodes, updatedEdges);
    }, 50),
    [updatePipelineFlow]
  );
  
  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      if (selectedPipeline) {
        debouncedUpdateFlow(selectedPipeline.id, updatedNodes, edges);
      }
    },
    [nodes, edges, selectedPipeline, debouncedUpdateFlow]
  );
  
  const onEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
      if (selectedPipeline) {
        debouncedUpdateFlow(selectedPipeline.id, nodes, updatedEdges);
      }
    },
    [nodes, edges, selectedPipeline, debouncedUpdateFlow]
  );
  
  const onConnect = useCallback(
    (params) => {
      const updatedEdges = addEdge(params, edges);
      setEdges(updatedEdges);
      if (selectedPipeline) {
        debouncedUpdateFlow(selectedPipeline.id, nodes, updatedEdges);
      }
    },
    [edges, nodes, selectedPipeline, debouncedUpdateFlow]
  );
  
  // Handle drag & drop
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  const onDrop = (event) => {
    event.preventDefault();
    if (!reactFlowInstance || !reactFlowWrapper.current) return;
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const nodeType = event.dataTransfer.getData('application/nodeType');
    const nodeSubType = event.dataTransfer.getData('application/nodeSubType');
    if (!nodeType) return;
    
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: 'default',
      position,
      data: { 
        label: `${nodeSubType ? nodeSubType.toUpperCase() : nodeType.toUpperCase()}`,
        type: nodeType,
        subType: nodeSubType || '',
        config: {}
      }
    };
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    if (selectedPipeline) {
      debouncedUpdateFlow(selectedPipeline.id, updatedNodes, edges);
    }
  };
  
  // Context menus
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setSelectedNode(node);
    setToolbarPosition({ x: event.clientX, y: event.clientY });
    setShowNodeToolbar(true);
  };
  
  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setSelectedEdge(edge);
    setEdgeToolbarPosition({ x: event.clientX, y: event.clientY });
    setShowEdgeToolbar(true);
  };
  
  const handleEditNode = () => {
    if (selectedNode) {
      setSelectedNodeForConfig(selectedNode);
      setShowNodeToolbar(false);
      setSelectedNode(null);
    }
  };
  
  const handleDeleteNode = () => {
    if (selectedNode) {
      const updatedNodes = nodes.filter(node => node.id !== selectedNode.id);
      setNodes(updatedNodes);
      if (selectedPipeline) {
        debouncedUpdateFlow(selectedPipeline.id, updatedNodes, edges);
      }
      setSelectedNode(null);
      setShowNodeToolbar(false);
    }
  };
  
  const handleDeleteEdge = () => {
    if (selectedEdge) {
      const updatedEdges = edges.filter(edge => edge.id !== selectedEdge.id);
      setEdges(updatedEdges);
      if (selectedPipeline) {
        debouncedUpdateFlow(selectedPipeline.id, nodes, updatedEdges);
      }
      setSelectedEdge(null);
      setShowEdgeToolbar(false);
    }
  };
  
  const handleAddNewNode = () => {
    const nodeType = prompt('Enter node type (source, transform, destination):');
    if (!nodeType) return;
    const label = prompt('Enter node label:');
    if (!label) return;
    let position = { x: 250, y: 250 };
    if (reactFlowInstance) {
      const { x, y, zoom } = reactFlowInstance.getViewport();
      position = {
        x: -x / zoom + (reactFlowWrapper.current?.clientWidth || 500) / 2 / zoom,
        y: -y / zoom + (reactFlowWrapper.current?.clientHeight || 400) / 2 / zoom
      };
    }
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: 'default',
      position,
      data: { 
        label,
        type: nodeType,
        subType: '',
        config: {}
      }
    };
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    if (selectedPipeline) {
      debouncedUpdateFlow(selectedPipeline.id, updatedNodes, edges);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSavePipeline = (newPipeline) => {
    addPipeline(newPipeline);
    setOpenDialog(false);
  };
  const simulatePipelineRun = () => {
    if (!selectedPipeline) return;
  
    const now = new Date().toLocaleString();
    const randomLoad = Math.floor(Math.random() * 81) + 10; // 10% - 90%
  
    // Sort nodes top-to-bottom
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    const nodeCount = sortedNodes.length;
  
    const runNodeSequentially = async (index) => {
      if (index >= nodeCount) {
        // Final update after all nodes complete
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        runPipeline(selectedPipeline.id, {
          lastRun: now,
          load: randomLoad,
          totalTime,
        });
        return;
      }
  
      const currentNode = sortedNodes[index];
      const nextNode = sortedNodes[index + 1];
      const runDuration = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000; // 2s - 6s
  
      // Mark current node as running
      setNodes(prevNodes =>
        prevNodes.map(n =>
          n.id === currentNode.id
            ? {
                ...n,
                data: { ...n.data, status: 'running' },
                style: { ...n.style, border: '3px solid orange', transition: 'border 0.5s' },
              }
            : n
        )
      );
  
      // Animate edge to next node
      if (nextNode) {
        setEdges(prevEdges =>
          prevEdges.map(edge =>
            edge.source === currentNode.id && edge.target === nextNode.id
              ? {
                  ...edge,
                  animated: true,
                  style: {
                    ...edge.style,
                    strokeDasharray: '5,5',
                    stroke: 'orange',
                    transition: 'stroke 0.5s',
                  },
                }
              : edge
          )
        );
      }
  
      // Wait for the duration before completing current node
      setTimeout(() => {
        // Mark node as completed
        setNodes(prevNodes =>
          prevNodes.map(n =>
            n.id === currentNode.id
              ? {
                  ...n,
                  data: { ...n.data, status: 'completed' },
                  style: { ...n.style, border: '3px solid green', transition: 'border 0.5s' },
                }
              : n
          )
        );
  
        // Stop edge animation
        if (nextNode) {
          setEdges(prevEdges =>
            prevEdges.map(edge =>
              edge.source === currentNode.id && edge.target === nextNode.id
                ? {
                    ...edge,
                    animated: false,
                    style: {
                      ...edge.style,
                      strokeDasharray: '0',
                      stroke: 'green',
                      transition: 'stroke 0.5s',
                    },
                  }
                : edge
            )
          );
        }
  
        // Continue to next node
        runNodeSequentially(index + 1);
      }, runDuration);
    };
  
    const startTime = Date.now();
    runNodeSequentially(0); // Start with the first node
  };
  
  const handleRunPipeline = (id, event) => {
    event.stopPropagation();
    simulatePipelineRun();
  };
  
  const onDragStart = (event, nodeType, nodeSubType) => {
    event.dataTransfer.setData('application/nodeType', nodeType);
    if (nodeSubType) {
      event.dataTransfer.setData('application/nodeSubType', nodeSubType);
    }
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const handleSaveConfig = (nodeId, newConfig) => {
    const updatedNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          data: {
            ...n.data,
            label: newConfig.label,
            config: newConfig
          }
        };
      }
      return n;
    });
    setNodes(updatedNodes);
    if (selectedPipeline) {
      debouncedUpdateFlow(selectedPipeline.id, updatedNodes, edges);
    }
    setSelectedNodeForConfig(null);
  };
  
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Left panel: Pipeline list and Node Toolbox */}
      <Box sx={{ width: '300px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: '1px solid #ddd', padding: 2, overflowY: 'auto', flexGrow: 0 }}>
          <Typography variant="h6">Pipelines</Typography>
          <List>
            {pipelines.map((pipeline) => (
              <React.Fragment key={pipeline.id}>
                <ListItem 
                  button 
                  onClick={() => setSelectedPipeline(pipeline)}
                  selected={selectedPipeline?.id === pipeline.id}
                >
                  <ListItemText
                    primary={pipeline.name}
                    secondary={
                      <>
                        {pipeline.description}
                        <br />
                        Last Run: {pipeline.lastRun || 'Never'}
                      </>
                    }
                  />
                  <IconButton 
                    onClick={(e) => handleRunPipeline(pipeline.id, e)}
                    color="primary"
                    size="small"
                  >
                    <PlayCircleOutlineIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Button variant="contained" color="primary" fullWidth onClick={handleOpenDialog} sx={{ mt: 2 }}>
            Add New Pipeline
          </Button>
        </Box>
        
        {/* Node Toolbox */}
        <Box sx={{ padding: 2, overflowY: 'auto', flexGrow: 1 }}>
          <Typography variant="h6">Node Toolbox</Typography>
          <Divider sx={{ my: 1 }} />
          {Object.entries(toolboxTypes).map(([nodeType, { typeLabel, options }]) => (
            <Box key={nodeType} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{typeLabel}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {options.map((option) => (
                  <Box
                    key={`${nodeType}-${option}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, nodeType, option)}
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      padding: '4px 8px',
                      backgroundColor: '#f5f5f5',
                      color: 'black',
                      cursor: 'grab',
                      fontSize: '0.85rem',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      }
                    }}
                  >
                    {option}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Right panel: Pipeline Builder */}
      <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }}>
        {selectedPipeline ? (
          <Box sx={{ padding: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {selectedPipeline.name} - Pipeline Builder
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleAddNewNode}>
                Add New Node
              </Button>
            </Box>
            <Paper 
              sx={{ height: 'calc(100% - 40px)', overflow: 'hidden' }}
              ref={reactFlowWrapper}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onInit={setReactFlowInstance}
                colorMode="dark"
                fitView
                fitViewOptions={{ padding: 0.2 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Controls />
                <MiniMap />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              Select a pipeline or create a new one
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Pipeline creation dialog */}
      <NewPipelineDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        onSave={handleSavePipeline} 
      />
      
      {/* Right-click context menu for nodes */}
      {showNodeToolbar && (
        <NodeToolbar
          position={toolbarPosition}
          selectedNode={selectedNode}
          onEdit={handleEditNode}
          onDelete={handleDeleteNode}
          onClose={() => {
            setShowNodeToolbar(false);
            setSelectedNode(null);
          }}
        />
      )}
      
      {/* Right-click context menu for edges */}
      {showEdgeToolbar && (
        <EdgeToolbar
          position={edgeToolbarPosition}
          selectedEdge={selectedEdge}
          onDelete={handleDeleteEdge}
          onClose={() => {
            setShowEdgeToolbar(false);
            setSelectedEdge(null);
          }}
        />
      )}
      
      {/* Node configuration modal */}
      {selectedNodeForConfig && (
        <NodeConfigModal
          node={selectedNodeForConfig}
          open={!!selectedNodeForConfig}
          onClose={() => setSelectedNodeForConfig(null)}
          onSave={handleSaveConfig}
        />
      )}
    </Box>
  );
};

export default Pipelines;
