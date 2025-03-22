const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Normalize paths to prevent directory traversal and fix double slashes
app.use((req, res, next) => {
  req.url = path.normalize(req.url).replace(/\\/g, '/');
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});

// Serve static files from the root directory
app.use(express.static(__dirname, {
  // Set appropriate cache headers
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// API proxy (if needed)
try {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  const apiTarget = process.env.API_URL || 'http://localhost:8080';
  
  app.use('/api', createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    logLevel: 'error'
  }));
  
  console.log(`API proxy configured to ${apiTarget}`);
} catch (error) {
  console.log('API proxy not configured:', error.message);
}

// SPA fallback - serve index.html for all routes that don't match a static file
app.use((req, res, next) => {
  // Skip if the request is for a file with a known extension
  // This prevents serving index.html for missing .js files
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|html|txt|json)$/)) {
    return next();
  }
  
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler for file not found
app.use((req, res) => {
  if (req.path.match(/\.(js|css|html|png|jpg|jpeg|gif|ico|svg)$/)) {
    console.error(`File not found: ${req.path}`);
    res.status(404).send(`File not found: ${req.path}`);
  } else {
    // For non-static files, still serve index.html
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Use Ctrl+C to stop the server`);
}); 