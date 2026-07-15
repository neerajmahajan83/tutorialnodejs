const fs = require('fs');
const path = require('path');

/**
 * Read data from file and convert to JSON format
 * Supports reading text files and converting them to JSON
 */

// Method 1: Read simple text file and convert to JSON
function readFileAsJSON(filePath) {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse content based on format
    let jsonData;
    
    // If file is JSON, parse directly
    if (path.extname(filePath) === '.json') {
      jsonData = JSON.parse(fileContent);
    } else {
      // If file is text, convert each line to an object
      const lines = fileContent.trim().split('\n');
      jsonData = {
        lines: lines,
        totalLines: lines.length,
        content: fileContent
      };
    }
    
    return jsonData;
  } catch (error) {
    console.error('Error reading file:', error.message);
    return null;
  }
}

// Method 2: Read CSV-like file and convert to JSON
function readCSVAsJSON(filePath, hasHeader = true) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    
    if (lines.length === 0) return [];
    
    let jsonData = [];
    let headers = [];
    
    if (hasHeader) {
      headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || null;
        });
        jsonData.push(obj);
      }
    } else {
      lines.forEach((line, index) => {
        const values = line.split(',').map(v => v.trim());
        jsonData.push({
          row: index + 1,
          data: values
        });
      });
    }
    
    return jsonData;
  } catch (error) {
    console.error('Error reading CSV file:', error.message);
    return null;
  }
}

// Method 3: Read JSON file with error handling
function readJSONFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return null;
  }
}

// Method 4: Read file asynchronously and return as JSON
async function readFileAsJSONAsync(filePath) {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    
    return {
      fileName: path.basename(filePath),
      filePath: filePath,
      data: lines,
      lineCount: lines.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading file asynchronously:', error.message);
    return null;
  }
}

// Method 5: Save JSON data to file
function saveJSONToFile(data, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`JSON data saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error saving JSON file:', error.message);
    return false;
  }
}

// Example usage
async function main() {
  console.log('=== Node.js File to JSON Conversion ===\n');
  
  // Example 1: Read text file
  console.log('Example 1: Reading text file as JSON');
  const inputFile = path.join(__dirname, 'input.txt');
  
  if (fs.existsSync(inputFile)) {
    const jsonData = readFileAsJSON(inputFile);
    console.log('Result:', JSON.stringify(jsonData, null, 2));
    
    // Save to JSON file
    saveJSONToFile(jsonData, path.join(__dirname, 'output.json'));
  } else {
    console.log('Input file not found. Creating sample file...');
    const sampleData = 'Line 1: Hello World\nLine 2: Node.js Tutorial\nLine 3: Read File to JSON';
    fs.writeFileSync(inputFile, sampleData);
    const jsonData = readFileAsJSON(inputFile);
    console.log('Result:', JSON.stringify(jsonData, null, 2));
    saveJSONToFile(jsonData, path.join(__dirname, 'output.json'));
  }
  
  // Example 2: Read CSV file
  console.log('\n\nExample 2: Reading CSV file as JSON');
  const csvFile = path.join(__dirname, 'data.csv');
  
  if (fs.existsSync(csvFile)) {
    const csvData = readCSVAsJSON(csvFile, true);
    console.log('Result:', JSON.stringify(csvData, null, 2));
    saveJSONToFile(csvData, path.join(__dirname, 'output_csv.json'));
  } else {
    console.log('CSV file not found. Creating sample CSV...');
    const sampleCSV = 'name,age,city\nJohn,25,New York\nJane,30,London\nBob,35,Tokyo';
    fs.writeFileSync(csvFile, sampleCSV);
    const csvData = readCSVAsJSON(csvFile, true);
    console.log('Result:', JSON.stringify(csvData, null, 2));
    saveJSONToFile(csvData, path.join(__dirname, 'output_csv.json'));
  }
  
  // Example 3: Async file reading
  console.log('\n\nExample 3: Reading file asynchronously');
  const asyncResult = await readFileAsJSONAsync(inputFile);
  console.log('Result:', JSON.stringify(asyncResult, null, 2));
}

// Run main function only if this file is executed directly
if (require.main === module) {
  main();
}

// Export functions for use as a module
module.exports = {
  readFileAsJSON,
  readCSVAsJSON,
  readJSONFile,
  readFileAsJSONAsync,
  saveJSONToFile
};
