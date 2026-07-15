const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const SERVER_URL = 'http://localhost:3001';

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            parsed: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    if (options.pipe) {
      options.pipe.pipe(req);
    } else {
      req.end();
    }
  });
}

/**
 * Upload file (plain text)
 */
async function uploadFile(filePath, filename = null) {
  try {
    console.log(`\n📤 Uploading file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath);
    const uploadFilename = filename || path.basename(filePath);

    const response = await makeRequest(`${SERVER_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'X-Filename': uploadFilename,
        'Content-Length': fileContent.length
      },
      body: fileContent
    });

    if (response.statusCode === 200) {
      console.log('✅ Upload successful!');
      console.log(JSON.stringify(response.parsed, null, 2));
      return response.parsed;
    } else {
      console.error('❌ Upload failed:', response.parsed);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

/**
 * List all files
 */
async function listFiles() {
  try {
    console.log('\n📋 Fetching file list...');

    const response = await makeRequest(`${SERVER_URL}/files`);

    if (response.statusCode === 200) {
      console.log('✅ Files retrieved successfully!');
      console.log(JSON.stringify(response.parsed, null, 2));
      return response.parsed;
    } else {
      console.error('❌ Failed to list files:', response.parsed);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

/**
 * Download file
 */
async function downloadFile(filename, outputPath = null) {
  try {
    console.log(`\n⬇️  Downloading file: ${filename}`);

    const response = await makeRequest(`${SERVER_URL}/download/${filename}`);

    if (response.statusCode === 200) {
      const savePath = outputPath || path.join(__dirname, `downloaded-${filename}`);
      fs.writeFileSync(savePath, response.body);
      console.log(`✅ Download complete! Saved to: ${savePath}`);
      return savePath;
    } else {
      console.error('❌ Download failed:', response.parsed);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

/**
 * Delete file
 */
async function deleteFile(filename) {
  try {
    console.log(`\n🗑️  Deleting file: ${filename}`);

    const response = await makeRequest(`${SERVER_URL}/files/${filename}`, {
      method: 'DELETE'
    });

    if (response.statusCode === 200) {
      console.log('✅ Delete successful!');
      console.log(JSON.stringify(response.parsed, null, 2));
      return response.parsed;
    } else {
      console.error('❌ Delete failed:', response.parsed);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

/**
 * Check server health
 */
async function checkServer() {
  try {
    const response = await makeRequest(SERVER_URL);
    return response.statusCode === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Main demo
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║    Basic File Upload Client            ║');
  console.log('║    (No External Dependencies)          ║');
  console.log('╚════════════════════════════════════════╝');

  // Check server
  console.log('\n🔍 Checking if server is running...');
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error('❌ Server is not running!');
    console.error('Start the server with:');
    console.error('  node upload-server-basic.js\n');
    return;
  }

  console.log('✅ Server is running!\n');

  try {
    // Demo 1: Upload single file
    console.log('═'.repeat(50));
    console.log('DEMO 1: Upload Single File');
    console.log('═'.repeat(50));
    const inputFile = path.join(__dirname, 'input.txt');
    if (fs.existsSync(inputFile)) {
      await uploadFile(inputFile);
    } else {
      console.log('⚠️  input.txt not found, skipping');
    }

    // Wait
    await new Promise(resolve => setTimeout(resolve, 500));

    // Demo 2: List files
    console.log('\n═'.repeat(50));
    console.log('DEMO 2: List All Files');
    console.log('═'.repeat(50));
    const fileList = await listFiles();

    // Demo 3: Upload another file
    console.log('\n═'.repeat(50));
    console.log('DEMO 3: Upload Second File');
    console.log('═'.repeat(50));
    const csvFile = path.join(__dirname, 'data.csv');
    if (fs.existsSync(csvFile)) {
      await uploadFile(csvFile);
    } else {
      console.log('⚠️  data.csv not found, skipping');
    }

    // Wait
    await new Promise(resolve => setTimeout(resolve, 500));

    // Demo 4: List files again
    console.log('\n═'.repeat(50));
    console.log('DEMO 4: List Files After Upload');
    console.log('═'.repeat(50));
    const updatedFileList = await listFiles();

    // Demo 5: Download file
    if (updatedFileList && updatedFileList.files && updatedFileList.files.length > 0) {
      console.log('\n═'.repeat(50));
      console.log('DEMO 5: Download File');
      console.log('═'.repeat(50));
      const firstFile = updatedFileList.files[0];
      await downloadFile(firstFile.filename);
    }

    console.log('\n═'.repeat(50));
    console.log('✅ All demos completed!');
    console.log('═'.repeat(50) + '\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export functions
module.exports = {
  uploadFile,
  listFiles,
  downloadFile,
  deleteFile,
  checkServer
};

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
