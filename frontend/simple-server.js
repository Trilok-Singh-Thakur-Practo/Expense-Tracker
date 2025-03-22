const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Detailed logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url}`);
  
  // Check if the requested file exists
  const filePath = path.join(__dirname, req.url);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    console.log(`File ${filePath} ${err ? 'does not exist' : 'exists'}`);
  });
  
  next();
});

// IMPORTANT: Serve static files FIRST - this must come before any routes
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    // Set proper MIME types for common file extensions
    if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      console.log(`Setting Content-Type for ${filePath}: application/javascript`);
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (ext === '.html') {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    }
  }
}));

// For all routes that don't match a static file AND don't end with a file extension
app.get(/^[^.]*$/, (req, res) => {
  console.log(`SPA route handler: ${req.url} -> serving index.html`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for any unhandled routes
app.use((req, res) => {
  console.log(`404 handler: ${req.url}`);
  // If it looks like a file request, return 404
  if (req.url.includes('.')) {
    return res.status(404).send(`File not found: ${req.url}`);
  }
  // Otherwise treat it as a SPA route
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop`);
}); 