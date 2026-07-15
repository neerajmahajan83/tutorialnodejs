# File Upload Operations

Complete guide for file upload implementation in Node.js with two approaches.

## 📝 Overview

This folder contains two complete file upload solutions:

1. **Basic Implementation** - No external dependencies, uses Node.js built-in modules
2. **Advanced Implementation** - Uses Express + Multer for production-grade uploads

---

## 🚀 Option 1: Basic File Upload (Recommended for Learning)

### Files
- **[upload-server-basic.js](upload-server-basic.js)** - HTTP server for file uploads
- **[upload-client-basic.js](upload-client-basic.js)** - HTTP client for uploading/downloading

### Requirements
- **Node.js only** - No external dependencies needed!

### Setup & Run

**Terminal 1: Start the server**
```bash
node upload-server-basic.js
```

**Terminal 2: Run the client (in separate terminal)**
```bash
node upload-client-basic.js
```

### Server Features
- ✅ Upload files via HTTP POST
- ✅ List all uploaded files
- ✅ Download files
- ✅ Delete files
- ✅ Built-in security (directory traversal prevention)
- ✅ JSON responses

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server info |
| POST | `/upload` | Upload file |
| GET | `/files` | List all files |
| GET | `/download/:filename` | Download file |
| DELETE | `/files/:filename` | Delete file |

### Server Output
```
╔════════════════════════════════════════╗
║  Basic File Upload Server Running      ║
║  (No External Dependencies)            ║
╠════════════════════════════════════════╣
║  Server: http://localhost:3001         ║
║  Uploads Dir: ./uploads                ║
╚════════════════════════════════════════╝
```

### Upload with cURL

```bash
# Upload file
curl -X POST \
  --data-binary @input.txt \
  -H "Content-Type: text/plain" \
  -H "X-Filename: myfile.txt" \
  http://localhost:3001/upload

# List files
curl http://localhost:3001/files

# Download file
curl http://localhost:3001/download/myfile.txt -o downloaded.txt

# Delete file
curl -X DELETE http://localhost:3001/files/myfile.txt
```

---

## 🎯 Option 2: Advanced File Upload (Production Grade)

### Files
- **[upload-server.js](upload-server.js)** - Express server with Multer
- **[upload-client.js](upload-client.js)** - Axios client for uploads

### Requirements
Install dependencies:
```bash
npm install express multer axios
```

### Features
- ✅ Single & multiple file uploads
- ✅ File type validation
- ✅ File size limits (5MB)
- ✅ Automatic filename generation
- ✅ MIME type checking
- ✅ Production-grade error handling
- ✅ Download & delete files

### Setup & Run

**Terminal 1: Start the server**
```bash
npm install express multer axios
node upload-server.js
```

**Terminal 2: Run the client**
```bash
node upload-client.js
```

### Advanced API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server info & limits |
| POST | `/upload` | Single file upload |
| POST | `/upload-multiple` | Multiple files upload (max 10) |
| GET | `/files` | List all with metadata |
| GET | `/files/:filename` | Download file |
| DELETE | `/files/:filename` | Delete file |

### Supported File Types
- `.txt` (text/plain)
- `.csv` (text/csv)
- `.json` (application/json)
- `.jpg` (image/jpeg)
- `.png` (image/png)
- `.pdf` (application/pdf)

### Upload Limits
- **Max File Size**: 5 MB
- **Max Files**: 10 per request

### Server Output
```
╔════════════════════════════════════════╗
║     File Upload Server Running         ║
╠════════════════════════════════════════╣
║  Server: http://localhost:3000         ║
║  Uploads Dir: ./uploads                ║
╚════════════════════════════════════════╝
```

---

## 💡 How to Use

### Method 1: Programmatic Upload (JavaScript)

**Using Basic Client:**
```javascript
const { uploadFile, listFiles, downloadFile } = require('./upload-client-basic.js');

// Upload a file
await uploadFile('./myfile.txt');

// List files
const files = await listFiles();

// Download a file
await downloadFile('filename.txt', './downloaded.txt');
```

**Using Advanced Client:**
```javascript
const { uploadSingleFile, uploadMultipleFiles, listFiles } = require('./upload-client.js');

// Upload single file
await uploadSingleFile('./myfile.txt');

// Upload multiple files
await uploadMultipleFiles(['./file1.txt', './file2.csv']);

// List all files
const files = await listFiles();
```

### Method 2: Command Line (cURL)

```bash
# Upload file (basic server)
curl -X POST \
  --data-binary @file.txt \
  -H "Content-Type: text/plain" \
  http://localhost:3001/upload

# Upload file (advanced server)
curl -F "file=@file.txt" http://localhost:3000/upload

# List files
curl http://localhost:3001/files

# Download
curl http://localhost:3001/download/filename.txt -o output.txt

# Delete
curl -X DELETE http://localhost:3001/files/filename.txt
```

### Method 3: Using Node.js HTTP Module

```javascript
const http = require('http');
const fs = require('fs');

const fileContent = fs.readFileSync('./file.txt');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'X-Filename': 'file.txt',
    'Content-Length': fileContent.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
});

req.write(fileContent);
req.end();
```

---

## 📊 Comparison

| Feature | Basic | Advanced |
|---------|-------|----------|
| Dependencies | None | Express, Multer |
| Difficulty | Easy | Medium |
| File Types | Plain text | Multiple formats |
| Validation | Basic | Advanced |
| Error Handling | Good | Production-grade |
| Performance | Good | Optimized |
| Learning Value | High | Very High |

---

## 🔒 Security Features

Both implementations include:
- ✅ Directory traversal prevention
- ✅ File type validation
- ✅ File size limits
- ✅ Unique filename generation
- ✅ Error handling
- ✅ CORS support (advanced)

---

## 📁 Project Structure

```
uploads/
  ├── file1.txt
  ├── file2.csv
  └── file3.json
```

All uploaded files are stored in the `uploads/` directory.

---

## 🎓 Learning Path

### Beginner
1. Start with **basic-server.js**
2. Try uploading with cURL
3. Check files with `/files` endpoint
4. Download with `/download/:filename`

### Intermediate
1. Use **basic-client.js** to automate uploads
2. Understand HTTP requests/responses
3. Learn about content-type headers
4. Try multiple file uploads

### Advanced
1. Switch to **upload-server.js** with Express
2. Add custom file validation
3. Implement progress tracking
4. Handle concurrent uploads

---

## ⚠️ Error Handling

### Common Errors

**Server not running:**
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```
Solution: Start the server first!

**File not found:**
```
Error: File not found: ./missing.txt
```
Solution: Check file path exists before uploading

**File size exceeded:**
```
Error: File size exceeds 5MB limit
```
Solution: Upload smaller files or change limit in code

**Invalid file type:**
```
Error: File type application/pdf not allowed
```
Solution: Use allowed file types or modify server config

---

## 🚀 Production Considerations

For production deployment:
- Use HTTPS instead of HTTP
- Implement authentication/authorization
- Add rate limiting
- Use cloud storage (S3, Azure Blob)
- Enable compression
- Add logging and monitoring
- Implement backup strategy
- Use virus scanning for uploaded files
- Add database for file metadata

---

## 🔧 Customization

### Change Upload Directory
```javascript
const uploadsDir = '/custom/path/uploads';
```

### Change Port
```javascript
const PORT = 5000; // Change from 3000/3001
```

### Change File Size Limit (Advanced)
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

### Add File Type
```javascript
const allowedTypes = [
  'text/plain',
  'application/xml'  // Add new type
];
```

---

## 📝 Example Responses

### Upload Success
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "1623456789-input.txt",
    "originalName": "input.txt",
    "size": 1024,
    "uploadedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### List Files
```json
{
  "files": [
    {
      "filename": "file1.txt",
      "size": 2048,
      "uploadedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "filename": "file2.csv",
      "size": 4096,
      "uploadedAt": "2024-01-01T12:05:00.000Z"
    }
  ]
}
```

---

## ✅ Testing Checklist

- [ ] Start server without errors
- [ ] Upload file successfully
- [ ] List uploaded files
- [ ] Download file
- [ ] Delete file
- [ ] Upload multiple files (advanced)
- [ ] Try invalid file type
- [ ] Try oversized file
- [ ] Test directory traversal prevention
- [ ] Check error messages

---

## 🎯 Next Steps

1. Extend server with database integration
2. Add user authentication
3. Implement progress tracking
4. Add file compression
5. Create web UI for uploads
6. Deploy to cloud
7. Add thumbnail generation for images
8. Implement file versioning

---

**Status**: ✅ Complete and Tested  
**Last Updated**: 2026-07-15
