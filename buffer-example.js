const fs = require('fs');
const path = require('path');

console.log('=== Node.js Buffer Examples ===\n');

// Example 1: Creating Buffers
console.log('Example 1: Creating Buffers');
console.log('-'.repeat(50));

// Method 1: From string
const buffer1 = Buffer.from('Hello World', 'utf8');
console.log('Buffer from string:', buffer1);
console.log('Buffer as string:', buffer1.toString());
console.log('Buffer length:', buffer1.length);

// Method 2: Allocate buffer
const buffer2 = Buffer.alloc(10);
console.log('\nAllocated buffer (10 bytes):', buffer2);

// Method 3: From array
const buffer3 = Buffer.from([72, 101, 108, 108, 111]);
console.log('Buffer from array:', buffer3.toString());

// Method 4: Buffer.allocUnsafe (faster, uninitialized)
const buffer4 = Buffer.allocUnsafe(5);
buffer4.write('Node');
console.log('Buffer allocUnsafe:', buffer4.toString());

console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Buffer Operations
console.log('Example 2: Buffer Operations');
console.log('-'.repeat(50));

const str = 'Node.js Buffer Tutorial';
const buf = Buffer.from(str);

console.log('Original:', buf.toString());
console.log('Slice (0-4):', buf.slice(0, 4).toString());
console.log('Slice (5-8):', buf.slice(5, 8).toString());
console.log('Character at index 0:', String.fromCharCode(buf[0]));

// Write to buffer
const writeBuf = Buffer.alloc(20);
writeBuf.write('Hello');
console.log('\nAfter write:', writeBuf.toString());

console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Buffer Concatenation
console.log('Example 3: Buffer Concatenation');
console.log('-'.repeat(50));

const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World ');
const buf3 = Buffer.from('Node.js');

const concatenated = Buffer.concat([buf1, buf2, buf3]);
console.log('Concatenated:', concatenated.toString());
console.log('Total length:', concatenated.length);

console.log('\n' + '='.repeat(50) + '\n');

// Example 4: Buffer Comparison
console.log('Example 4: Buffer Comparison');
console.log('-'.repeat(50));

const bufA = Buffer.from('ABC');
const bufB = Buffer.from('ABC');
const bufC = Buffer.from('ABD');

console.log('Buffer ABC equals ABC:', bufA.equals(bufB));
console.log('Buffer ABC equals ABD:', bufA.equals(bufC));
console.log('Compare ABC with ABD:', bufA.compare(bufC));

console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Working with Binary Data
console.log('Example 5: Binary Data Manipulation');
console.log('-'.repeat(50));

// Create buffer with binary data
const binaryBuf = Buffer.alloc(4);
binaryBuf.writeUInt32BE(0x12345678);
console.log('Hex representation:', binaryBuf.toString('hex'));
console.log('As integer:', binaryBuf.readUInt32BE());

// Different encodings
const text = 'Node.js';
const utf8Buf = Buffer.from(text, 'utf8');
const base64Buf = Buffer.from(utf8Buf.toString('base64'), 'utf8');

console.log('UTF-8:', utf8Buf.toString());
console.log('Base64 encoded:', Buffer.from(text).toString('base64'));
console.log('Base64 decoded:', Buffer.from(Buffer.from(text).toString('base64'), 'base64').toString());

console.log('\n' + '='.repeat(50) + '\n');

// Example 6: Reading File as Buffer
console.log('Example 6: Reading File as Buffer');
console.log('-'.repeat(50));

const inputFile = path.join(__dirname, 'input.txt');

try {
  const fileBuffer = fs.readFileSync(inputFile);
  console.log('File size:', fileBuffer.length, 'bytes');
  console.log('File content:', fileBuffer.toString());
  console.log('Hex dump (first 50 chars):', fileBuffer.slice(0, 50).toString('hex'));
} catch (error) {
  console.error('Error reading file:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Example 7: Buffer Loop and Iteration
console.log('Example 7: Buffer Loop and Iteration');
console.log('-'.repeat(50));

const loopBuf = Buffer.from('ABCDE');

console.log('Using forEach:');
loopBuf.forEach((byte, index) => {
  console.log(`Index ${index}: ${String.fromCharCode(byte)} (${byte})`);
});

console.log('\nUsing for loop:');
for (let i = 0; i < loopBuf.length; i++) {
  console.log(`loopBuf[${i}] = ${loopBuf[i]}`);
}

console.log('\n' + '='.repeat(50) + '\n');

// Example 8: Converting Buffer to Different Formats
console.log('Example 8: Buffer Format Conversions');
console.log('-'.repeat(50));

const originalBuf = Buffer.from('Node.js Tutorial');

console.log('Original (utf8):', originalBuf.toString('utf8'));
console.log('As JSON:', originalBuf.toJSON());
console.log('As String:', originalBuf.toString());

console.log('\n' + '='.repeat(50) + '\n');

// Example 9: Buffer Performance
console.log('Example 9: Buffer Performance Tips');
console.log('-'.repeat(50));

console.log('✓ Use Buffer.from() for known data');
console.log('✓ Use Buffer.alloc() for safe allocation');
console.log('✓ Avoid Buffer() constructor (deprecated)');
console.log('✓ Use Buffer.allocUnsafe() for performance-critical code');
console.log('✓ Pre-allocate buffers when size is known');
console.log('✓ Reuse buffers to reduce GC pressure');

// Example: Reusing buffer
const reusableBuf = Buffer.allocUnsafe(100);
function processData(data, buffer) {
  buffer.write(data);
  return buffer.slice(0, buffer.lastIndexOf('\n'));
}

console.log('\n' + '='.repeat(50));
console.log('\n✅ All Buffer examples completed!');
