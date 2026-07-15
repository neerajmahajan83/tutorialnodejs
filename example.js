const { 
  readFileAsJSON, 
  readCSVAsJSON, 
  readJSONFile, 
  readFileAsJSONAsync,
  saveJSONToFile 
} = require('./index.js');

const path = require('path');

console.log('📁 File to JSON Conversion Examples\n');
console.log('='.repeat(50) + '\n');

// Example 1: Read text file and convert to JSON
console.log('✅ Example 1: Reading text file (input.txt)');
const textResult = readFileAsJSON(path.join(__dirname, 'input.txt'));
console.log(JSON.stringify(textResult, null, 2));
console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Read CSV and convert to JSON
console.log('✅ Example 2: Reading CSV file (data.csv)');
const csvResult = readCSVAsJSON(path.join(__dirname, 'data.csv'), true);
console.log(JSON.stringify(csvResult, null, 2));
console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Async file reading
console.log('✅ Example 3: Async file reading');
readFileAsJSONAsync(path.join(__dirname, 'input.txt'))
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
    console.log('\n' + '='.repeat(50));
    console.log('\n📝 All examples completed successfully!');
  })
  .catch(err => console.error('Error:', err));
