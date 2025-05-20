import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { sql } from '@codemirror/lang-sql';

const transformationTemplates = {
  filter: "SELECT * FROM source_table WHERE condition;",
  join: "SELECT left.*, right.* FROM left_table AS left JOIN right_table AS right ON left.id = right.left_id;",
  aggregate: "SELECT key, COUNT(*) FROM source_table GROUP BY key;",
  sort: "SELECT * FROM source_table ORDER BY column_name DESC;",
  clean: "SELECT DISTINCT * FROM source_table;"
};

const NodeConfigModal = ({ node, open, onClose, onSave }) => {
  // Initialize the config with node label and other settings.
  const [nodeType, setNodeType] = useState(node.data.type || 'source');
  const [config, setConfig] = useState({
    label: node.data.label || '',
    nodeType: node.data.type || 'source',
    connectionString: node.data.config?.connectionString || '',
    sql: node.data.config?.sql || (node.data.type === 'source' ? "SELECT * FROM table_name LIMIT 10;" : ''),
    apiEndpoint: node.data.config?.apiEndpoint || '',
    apiKey: node.data.config?.apiKey || '',
    transformationSQL: node.data.config?.transformationSQL || (node.data.type === 'transform' ? transformationTemplates.filter : ''),
    transformationDesc: node.data.config?.transformationDesc || '',
    targetConnection: node.data.config?.targetConnection || '',
    stagingArea: node.data.config?.stagingArea || '',
  });

  // For transformation nodes: state to manage template selection.
  const [selectedTransformTemplate, setSelectedTransformTemplate] = useState('filter');

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (value) => {
    setNodeType(value);
    handleChange('nodeType', value);
  };

  const handleApplyTemplate = () => {
    const templateSQL = transformationTemplates[selectedTransformTemplate];
    handleChange('transformationSQL', templateSQL);
  };

  const handleSubmit = () => {
    onSave(node.id, config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit {node.data.label} Configuration</DialogTitle>
      <DialogContent>
        {/* Editable Node Label */}
        <TextField
          label="Node Label"
          fullWidth
          margin="normal"
          value={config.label}
          onChange={(e) => handleChange('label', e.target.value)}
        />

        {/* Node Type Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="node-type-label">Node Type</InputLabel>
          <Select
            labelId="node-type-label"
            value={nodeType}
            label="Node Type"
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <MenuItem value="source">Source</MenuItem>
            <MenuItem value="api">API</MenuItem>
            <MenuItem value="transform">Transformation</MenuItem>
            <MenuItem value="destination">Destination</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ my: 2 }} />

        {nodeType === 'source' && (
          <>
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              value={config.connectionString}
              onChange={(e) => handleChange('connectionString', e.target.value)}
            />
            <Typography variant="subtitle1" gutterBottom>
              SQL Query
            </Typography>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <CodeMirror
                value={config.sql}
                height="200px"
                theme={githubDark}
                extensions={[sql()]}
                onChange={(value) => handleChange('sql', value)}
              />
            </div>
          </>
        )}

        {nodeType === 'api' && (
          <>
            <TextField
              label="API Endpoint"
              fullWidth
              margin="normal"
              value={config.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
            />
            <TextField
              label="API Key"
              fullWidth
              margin="normal"
              value={config.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
            />
          </>
        )}

        {nodeType === 'transform' && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="template-select-label">Transformation Template</InputLabel>
              <Select
                labelId="template-select-label"
                value={selectedTransformTemplate}
                label="Transformation Template"
                onChange={(e) => setSelectedTransformTemplate(e.target.value)}
              >
                {Object.keys(transformationTemplates).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleApplyTemplate} sx={{ mt: 1, mb: 2 }}>
              Apply Template
            </Button>
            <Typography variant="subtitle1" gutterBottom>
              Transformation SQL
            </Typography>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <CodeMirror
                value={config.transformationSQL}
                height="200px"
                theme={githubDark}
                extensions={[sql()]}
                onChange={(value) => handleChange('transformationSQL', value)}
              />
            </div>
            <TextField
              label="Transformation Description"
              fullWidth
              margin="normal"
              value={config.transformationDesc}
              onChange={(e) => handleChange('transformationDesc', e.target.value)}
            />
          </>
        )}

        {nodeType === 'destination' && (
          <>
            <TextField
              label="Target Connection"
              fullWidth
              margin="normal"
              value={config.targetConnection}
              onChange={(e) => handleChange('targetConnection', e.target.value)}
            />
            <TextField
              label="Staging Area"
              fullWidth
              margin="normal"
              value={config.stagingArea}
              onChange={(e) => handleChange('stagingArea', e.target.value)}
            />
          </>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Save Configuration
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NodeConfigModal;
