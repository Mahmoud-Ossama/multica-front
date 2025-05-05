// Simple Express server to serve static files and provide a health check
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Log startup information
console.log('Starting server...');
console.log('Working directory:', process.cwd());
console.log('Build directory exists:', fs.existsSync(path.join(process.cwd(), 'build')));

// Health check endpoint - respond immediately with 200 OK
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).send('OK');
});

// Serve static files from build directory
try {
  if (fs.existsSync(path.join(process.cwd(), 'build'))) {
    app.use(express.static(path.join(process.cwd(), 'build')));
    console.log('Serving static files from:', path.join(process.cwd(), 'build'));
  } else {
    console.warn('Build directory not found, serving minimal content');
    app.get('/', (req, res) => res.send('App is running but build directory not found'));
  }
} catch (error) {
  console.error('Error setting up static file serving:', error);
}

// Handle SPA routing
app.get('*', (req, res) => {
  console.log('Requested path:', req.path);
  try {
    const indexPath = path.join(process.cwd(), 'build', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send('index.html not found');
    }
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal server error');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something went wrong');
});

// Start the server with error handling
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
