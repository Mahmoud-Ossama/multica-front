// Minimal HTTP server with better error handling and debugging
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Log function with timestamps
const log = (message, ...args) => {
  console.log(`${new Date().toISOString()} - ${message}`, ...args);
};

// Error log function 
const logError = (message, ...args) => {
  console.error(`${new Date().toISOString()} - ERROR: ${message}`, ...args);
};

// Create a simple HTML page
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multaqa Frontend</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #6F1A07; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Multaqa Platform</h1>
  <div class="card">
    <h2>Frontend Server</h2>
    <p>The server is running successfully.</p>
    <p>This is a temporary placeholder. The full React application will be deployed soon.</p>
  </div>
</body>
</html>
`;

// Define port - Make sure to use the PORT environment variable
const PORT = process.env.PORT || 8080;

try {
  // Create server
  const server = http.createServer((req, res) => {
    try {
      // Log incoming request
      log(`Request: ${req.method} ${req.url}`);
      
      // Set CORS headers for all responses
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Handle OPTIONS requests (for CORS preflight)
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // Handle health check route
      if (req.url === '/health') {
        log('Health check request received');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
        return;
      }

      // Serve static files from public directory
      const publicDir = path.join(process.cwd(), 'public');
      const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
      
      // Check if the file exists
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const contentType = getContentType(filePath);
        const content = fs.readFileSync(filePath);
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content);
        return;
      }
      
      // For all non-API routes, serve index.html (for client-side routing)
      if (!req.url.startsWith('/api')) {
        const indexPath = path.join(publicDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath);
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(content);
          return;
        }
      }
      
      // Fallback
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end(htmlContent);
    } catch (err) {
      logError('Request handler error:', err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
    }
  });

  // Start server with specific host binding
  server.listen(PORT, '0.0.0.0', () => {
    log(`Server started on port ${PORT}`);
    log(`Environment: ${JSON.stringify(process.env.NODE_ENV)}`);
    log(`Current directory: ${process.cwd()}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    logError('Server error:', err);
    process.exit(1);
  });

  // Handle process termination
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    server.close(() => {
      log('Server closed');
      process.exit(0);
    });
  });

} catch (err) {
  logError('Fatal error during server initialization:', err);
  process.exit(1);
}

// Helper function to determine content type
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html': return 'text/html';
    case '.js': return 'text/javascript';
    case '.css': return 'text/css';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
}
