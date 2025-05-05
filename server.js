// Minimal HTTP server - no Express, just Node.js http module
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - Request received: ${req.method} ${req.url}`);
  
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle health check route
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
    return;
  }
  
  // For all other routes
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body><h1>Multaqa Frontend</h1><p>Health check test</p></body></html>');
});

// Define port
const PORT = process.env.PORT || 8080;

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`${new Date().toISOString()} - Server started on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error(`${new Date().toISOString()} - Server error:`, err);
});
