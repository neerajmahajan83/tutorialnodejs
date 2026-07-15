const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

console.log('=== Node.js Piping Examples ===\n');

// ============================================
// PIPING EXAMPLE 1: File-to-File Piping
// ============================================

console.log('📋 PIPING EXAMPLE 1: File-to-File Piping');
console.log('='.repeat(50) + '\n');

function example1FileToFile() {
  console.log('Description: Copy data from input.txt to piped-output.txt using streams\n');

  const inputPath = path.join(__dirname, 'input.txt');
  const outputPath = path.join(__dirname, 'piped-output.txt');

  // Create read and write streams
  const readStream = fs.createReadStream(inputPath, { encoding: 'utf8' });
  const writeStream = fs.createWriteStream(outputPath);

  // Handle events
  readStream.on('open', () => {
    console.log('✓ Read stream opened');
  });

  readStream.on('data', (chunk) => {
    console.log(`✓ Data chunk read: "${chunk.substring(0, 20)}..."`);
  });

  readStream.on('end', () => {
    console.log('✓ Read stream ended');
  });

  writeStream.on('open', () => {
    console.log('✓ Write stream opened');
  });

  writeStream.on('finish', () => {
    console.log('✓ File piping completed successfully!');
    console.log(`✓ Output written to: ${outputPath}\n`);
  });

  writeStream.on('error', (error) => {
    console.error('✗ Write error:', error.message);
  });

  readStream.on('error', (error) => {
    console.error('✗ Read error:', error.message);
  });

  // Pipe data from read stream to write stream
  readStream.pipe(writeStream);
}

// Execute example 1
example1FileToFile();

// ============================================
// PIPING EXAMPLE 2: Piping with Transform Stream
// ============================================

// Wait for example 1 to complete before starting example 2
setTimeout(() => {
  console.log('='.repeat(50) + '\n');
  console.log('📋 PIPING EXAMPLE 2: Piping with Transform Stream');
  console.log('='.repeat(50) + '\n');

  function example2PipingWithTransform() {
    console.log('Description: Read input.txt, transform to uppercase, write to transformed.txt\n');

    const inputPath = path.join(__dirname, 'input.txt');
    const outputPath = path.join(__dirname, 'transformed.txt');

    // Create a transform stream
    const uppercaseTransform = new Transform({
      transform(chunk, encoding, callback) {
        const uppercase = chunk.toString().toUpperCase();
        console.log(`✓ Transformed chunk: "${chunk.toString().substring(0, 20)}..." → "${uppercase.substring(0, 20)}..."`);
        this.push(uppercase);
        callback();
      }
    });

    // Create read and write streams
    const readStream = fs.createReadStream(inputPath, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(outputPath);

    readStream.on('open', () => {
      console.log('✓ Read stream opened');
    });

    readStream.on('end', () => {
      console.log('✓ Read stream ended');
    });

    writeStream.on('open', () => {
      console.log('✓ Write stream opened');
    });

    writeStream.on('finish', () => {
      console.log('✓ Transformation piping completed successfully!');
      console.log(`✓ Transformed output written to: ${outputPath}\n`);

      // Display the transformed content
      setTimeout(() => {
        const content = fs.readFileSync(outputPath, 'utf8');
        console.log('Transformed file content:');
        console.log(content);
        console.log('');
      }, 100);
    });

    writeStream.on('error', (error) => {
      console.error('✗ Write error:', error.message);
    });

    readStream.on('error', (error) => {
      console.error('✗ Read error:', error.message);
    });

    // Pipe: readStream -> transform -> writeStream
    readStream
      .pipe(uppercaseTransform)
      .pipe(writeStream);
  }

  // Execute example 2
  example2PipingWithTransform();

}, 1000);

// ============================================
// BONUS: Additional Piping Scenarios
// ============================================

setTimeout(() => {
  console.log('='.repeat(50) + '\n');
  console.log('💡 BONUS: Other Piping Scenarios\n');

  console.log('1. Piping with Error Handling:');
  console.log('   readStream.on("error", errorHandler).pipe(writeStream)\n');

  console.log('2. Pipeline Method (Node.js 15+):');
  console.log('   pipeline(stream1, stream2, stream3, callback)\n');

  console.log('3. Chain Multiple Transforms:');
  console.log('   readStream.pipe(transform1).pipe(transform2).pipe(writeStream)\n');

  console.log('4. Use Cases:');
  console.log('   ✓ File compression/decompression');
  console.log('   ✓ Log file processing');
  console.log('   ✓ Data format conversion');
  console.log('   ✓ Real-time data processing\n');

  console.log('='.repeat(50));
  console.log('\n✅ All piping examples completed!');
}, 2000);
