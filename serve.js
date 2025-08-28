#!/usr/bin/env node

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4173;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all non-static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 PWA Server running at http://localhost:${port}`);
  console.log('📱 Open in your browser to test PWA installation!');
});
