const http = require('http');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const PORT = 3001;

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET / - Welcome
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Basic File Upload Server (No External Dependencies)',
      endpoints: {
        'POST /upload': 'Upload file with form data',
        'GET /files': 'List uploaded files',
        'DELETE /files/:filename': 'Delete file',
        'GET /download/:filename': 'Download file'
      }
    }, null, 2));
    return;
  }

  // GET /files - List all files
  if (req.method === 'GET' && req.url === '/files') {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not list files' }));
        return;
      }

      const fileDetails = files.map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: stats.size,
          uploadedAt: stats.birthtime
        };
      });

      res.writeHead(200);
      res.end(JSON.stringify({ files: fileDetails }, null, 2));
    });
    return;
  }

  // POST /upload - Upload file
  if (req.method === 'POST' && req.url === '/upload') {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'No content type provided' }));
      return;
    }

    // Simple text file upload
    if (contentType === 'text/plain') {
      const filename = `${Date.now()}-${req.headers['x-filename'] || 'file.txt'}`;
      const filePath = path.join(uploadsDir, filename);
      const writeStream = fs.createWriteStream(filePath);

      let fileSize = 0;

      req.on('data', (chunk) => {
        fileSize += chunk.length;
      });

      req.pipe(writeStream);

      writeStream.on('finish', () => {
        res.writeHead(200);
        res.end(JSON.stringify({
          message: 'File uploaded successfully',
          file: {
            filename,
            size: fileSize,
            path: `/download/${filename}`,
            uploadedAt: new Date().toISOString()
          }
        }, null, 2));
      });

      writeStream.on('error', (err) => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      });

      req.on('error', (err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err.message }));
      });
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Content type not supported. Use text/plain' }));
    }
    return;
  }

  // GET /download/:filename - Download file
  if (req.method === 'GET' && req.url.startsWith('/download/')) {
    const filename = req.url.replace('/download/', '');
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      res.writeHead(403);
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return;
    }

    const filePath = path.join(uploadsDir, filename);

    fs.exists(filePath, (exists) => {
      if (!exists) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    });
    return;
  }

  // DELETE /files/:filename - Delete file
  if (req.method === 'DELETE' && req.url.startsWith('/files/')) {
    const filename = req.url.replace('/files/', '');
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      res.writeHead(403);
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return;
    }

    const filePath = path.join(uploadsDir, filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'File deleted successfully' }));
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Basic File Upload Server Running      ║
║  (No External Dependencies)            ║
╠════════════════════════════════════════╣
║  Server: http://localhost:${PORT}        ║
║  Uploads Dir: ${uploadsDir}  ║
╚════════════════════════════════════════╝

Available Endpoints:
  GET  http://localhost:${PORT}/
  POST http://localhost:${PORT}/upload (plain text)
  GET  http://localhost:${PORT}/files (list all)
  GET  http://localhost:${PORT}/download/:filename
  DELETE http://localhost:${PORT}/files/:filename

Press Ctrl+C to stop the server
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
