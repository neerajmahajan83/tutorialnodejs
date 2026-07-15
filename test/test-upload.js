const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

describe('File Upload Server (Basic)', () => {
  let server;
  const PORT = 3002;
  const uploadsDir = path.join(__dirname, '../test-uploads');

  // Start test server
  before((done) => {
    // Create uploads directory
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const handleRequest = (req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');

      // GET / - Info
      if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Test Server Running' }));
      }

      // GET /files - List files
      if (req.method === 'GET' && req.url === '/files') {
        fs.readdir(uploadsDir, (err, files) => {
          const fileDetails = files.map(f => ({
            filename: f,
            size: fs.statSync(path.join(uploadsDir, f)).size
          }));
          res.writeHead(200);
          res.end(JSON.stringify({ files: fileDetails }));
        });
      }

      // POST /upload
      if (req.method === 'POST' && req.url === '/upload') {
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
            message: 'File uploaded',
            file: { filename, size: fileSize }
          }));
        });

        writeStream.on('error', (err) => {
          res.writeHead(500);
          res.end(JSON.stringify({ error: err.message }));
        });
      }

      // DELETE /files/:filename
      if (req.method === 'DELETE' && req.url.startsWith('/files/')) {
        const filename = req.url.replace('/files/', '');
        const filePath = path.join(uploadsDir, filename);

        fs.unlink(filePath, (err) => {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not found' }));
            return;
          }
          res.writeHead(200);
          res.end(JSON.stringify({ message: 'Deleted' }));
        });
      }
    };

    server = http.createServer(handleRequest);
    server.listen(PORT, done);
  });

  after((done) => {
    server.close(() => {
      // Cleanup uploads directory
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        files.forEach(f => {
          fs.unlinkSync(path.join(uploadsDir, f));
        });
        fs.rmdirSync(uploadsDir);
      }
      done();
    });
  });

  describe('Server Basic Operations', () => {
    it('should respond to GET /', (done) => {
      const req = http.get(`http://localhost:${PORT}/`, (res) => {
        assert.strictEqual(res.statusCode, 200);
        done();
      });
      req.on('error', done);
    });

    it('should list files on GET /files', (done) => {
      http.get(`http://localhost:${PORT}/files`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const parsed = JSON.parse(data);
          assert.ok(Array.isArray(parsed.files));
          done();
        });
      }).on('error', done);
    });
  });

  describe('File Upload', () => {
    it('should upload file successfully', (done) => {
      const testContent = 'Test file content';
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'X-Filename': 'test-upload.txt',
          'Content-Length': testContent.length
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const parsed = JSON.parse(data);
          assert.strictEqual(parsed.message, 'File uploaded');
          assert.ok(parsed.file.filename);
          done();
        });
      });

      req.on('error', done);
      req.write(testContent);
      req.end();
    });

    it('should handle multiple file uploads', (done) => {
      let completed = 0;

      for (let i = 0; i < 2; i++) {
        const testContent = `File ${i} content`;
        const options = {
          hostname: 'localhost',
          port: PORT,
          path: '/upload',
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'X-Filename': `file-${i}.txt`,
            'Content-Length': testContent.length
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            completed++;
            if (completed === 2) {
              done();
            }
          });
        });

        req.on('error', done);
        req.write(testContent);
        req.end();
      }
    });
  });

  describe('File Management', () => {
    let uploadedFilename;

    beforeEach((done) => {
      const testContent = 'Content for deletion test';
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'X-Filename': 'delete-test.txt',
          'Content-Length': testContent.length
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const parsed = JSON.parse(data);
          uploadedFilename = parsed.file.filename;
          done();
        });
      });

      req.write(testContent);
      req.end();
    });

    it('should delete uploaded file', (done) => {
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: `/files/${uploadedFilename}`,
        method: 'DELETE'
      };

      const req = http.request(options, (res) => {
        assert.strictEqual(res.statusCode, 200);
        done();
      });

      req.on('error', done);
      req.end();
    });

    it('should return 404 for non-existent file deletion', (done) => {
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/files/nonexistent-file.txt',
        method: 'DELETE'
      };

      const req = http.request(options, (res) => {
        assert.strictEqual(res.statusCode, 404);
        done();
      });

      req.on('error', done);
      req.end();
    });
  });

  describe('Error Handling', () => {
    it('should handle POST without filename header', (done) => {
      const testContent = 'Test content';
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': testContent.length
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const parsed = JSON.parse(data);
          assert.ok(parsed.file.filename);
          done();
        });
      });

      req.write(testContent);
      req.end();
    });
  });
});
