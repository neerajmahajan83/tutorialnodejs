const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter - allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/json',
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

/**
 * GET / - Welcome page
 */
app.get('/', (req, res) => {
  res.json({
    message: 'File Upload Server',
    endpoints: {
      'POST /upload': 'Single file upload',
      'POST /upload-multiple': 'Multiple files upload',
      'GET /files': 'List uploaded files',
      'GET /files/:filename': 'Download file',
      'DELETE /files/:filename': 'Delete file'
    },
    limits: {
      maxFileSize: '5MB',
      allowedTypes: ['text/plain', 'text/csv', 'application/json', 'image/jpeg', 'image/png', 'application/pdf']
    }
  });
});

/**
 * POST /upload - Single file upload
 */
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /upload-multiple - Multiple files upload
 */
app.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`
    }));

    res.json({
      message: `${req.files.length} file(s) uploaded successfully`,
      files: uploadedFiles,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /files - List all uploaded files
 */
app.get('/files', (req, res) => {
  try {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Could not list files' });
      }

      const fileDetails = files.map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename: filename,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          downloadLink: `/files/${filename}`
        };
      });

      res.json({
        message: `Found ${files.length} file(s)`,
        files: fileDetails
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /files/:filename - Download file
 */
app.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    // Validate path to prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /files/:filename - Delete file
 */
app.delete('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    // Validate path to prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: `File "${filename}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }

  res.status(500).json({ error: error.message || 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     File Upload Server Running         ║
╠════════════════════════════════════════╣
║  Server: http://localhost:${PORT}         ║
║  Uploads Dir: ${uploadsDir}  ║
╚════════════════════════════════════════╝

Available Endpoints:
  GET  http://localhost:${PORT}/
  POST http://localhost:${PORT}/upload (single file)
  POST http://localhost:${PORT}/upload-multiple (multiple files)
  GET  http://localhost:${PORT}/files (list all)
  GET  http://localhost:${PORT}/files/:filename (download)
  DELETE http://localhost:${PORT}/files/:filename (delete)

Max File Size: 5MB
Allowed Types: txt, csv, json, jpg, png, pdf

Press Ctrl+C to stop the server
  `);
});
