const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

/**
 * Upload a single file
 */
async function uploadSingleFile(filePath) {
  try {
    console.log(`\n📤 Uploading single file: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${SERVER_URL}/upload`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('✅ Upload successful!');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

/**
 * Upload multiple files
 */
async function uploadMultipleFiles(filePaths) {
  try {
    console.log(`\n📤 Uploading ${filePaths.length} file(s)...`);

    const formData = new FormData();

    // Add files to form data
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      formData.append('files', fs.createReadStream(filePath));
    }

    const response = await axios.post(`${SERVER_URL}/upload-multiple`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('✅ Upload successful!');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

/**
 * List all uploaded files
 */
async function listFiles() {
  try {
    console.log('\n📋 Fetching file list...');

    const response = await axios.get(`${SERVER_URL}/files`);
    console.log('✅ Files retrieved successfully!');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Failed to list files:', error.message);
  }
}

/**
 * Download a file
 */
async function downloadFile(filename, outputPath) {
  try {
    console.log(`\n⬇️  Downloading file: ${filename}`);

    const response = await axios.get(`${SERVER_URL}/files/${filename}`, {
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Download complete! Saved to: ${outputPath}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Download failed:', error.message);
  }
}

/**
 * Delete a file
 */
async function deleteFile(filename) {
  try {
    console.log(`\n🗑️  Deleting file: ${filename}`);

    const response = await axios.delete(`${SERVER_URL}/files/${filename}`);
    console.log('✅ Delete successful!');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Delete failed:', error.message);
  }
}

/**
 * Main demo function
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║    File Upload Client Demo             ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Ensure server is running
    console.log('\n🔍 Checking if server is running...');
    const healthCheck = await axios.get(SERVER_URL).catch(() => null);
    
    if (!healthCheck) {
      console.error('❌ Server is not running!');
      console.error('Please start the server first:');
      console.error('  node upload-server.js\n');
      return;
    }

    console.log('✅ Server is running!\n');

    // Demo 1: Upload single file
    console.log('═'.repeat(50));
    console.log('DEMO 1: Upload Single File');
    console.log('═'.repeat(50));
    await uploadSingleFile(path.join(__dirname, 'input.txt'));

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo 2: List files
    console.log('\n═'.repeat(50));
    console.log('DEMO 2: List All Files');
    console.log('═'.repeat(50));
    const fileList = await listFiles();

    // Demo 3: Upload multiple files
    console.log('\n═'.repeat(50));
    console.log('DEMO 3: Upload Multiple Files');
    console.log('═'.repeat(50));
    await uploadMultipleFiles([
      path.join(__dirname, 'input.txt'),
      path.join(__dirname, 'data.csv')
    ]);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo 4: List files again
    console.log('\n═'.repeat(50));
    console.log('DEMO 4: List Files After Multiple Upload');
    console.log('═'.repeat(50));
    await listFiles();

    // Demo 5: Download a file
    if (fileList && fileList.files && fileList.files.length > 0) {
      console.log('\n═'.repeat(50));
      console.log('DEMO 5: Download File');
      console.log('═'.repeat(50));
      const firstFile = fileList.files[0];
      await downloadFile(firstFile.filename, path.join(__dirname, `downloaded-${firstFile.filename}`));
    }

    console.log('\n═'.repeat(50));
    console.log('✅ All demos completed!');
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export functions for use as module
module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  listFiles,
  downloadFile,
  deleteFile
};

// Run demo if executed directly
if (require.main === module) {
  main();
}
