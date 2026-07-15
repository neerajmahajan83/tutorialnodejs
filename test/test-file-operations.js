const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  readFileAsJSON,
  readCSVAsJSON,
  readJSONFile,
  readFileAsJSONAsync,
  saveJSONToFile
} = require('../index.js');

describe('File Reading & JSON Conversion', () => {
  const testDir = path.join(__dirname, '../test-files');
  
  // Setup test files
  before(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  // Cleanup
  after(() => {
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
  });

  // ============================================
  // readFileAsJSON Tests
  // ============================================
  describe('readFileAsJSON()', () => {
    let testFilePath;

    beforeEach(() => {
      testFilePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(testFilePath, 'Line 1\nLine 2\nLine 3');
    });

    it('should read a text file and convert to JSON', () => {
      const result = readFileAsJSON(testFilePath);
      assert.ok(result);
      assert.ok(result.lines);
      assert.strictEqual(result.lines.length, 3);
    });

    it('should contain correct file content', () => {
      const result = readFileAsJSON(testFilePath);
      assert.strictEqual(result.lines[0], 'Line 1');
      assert.strictEqual(result.lines[1], 'Line 2');
      assert.strictEqual(result.lines[2], 'Line 3');
    });

    it('should have totalLines property', () => {
      const result = readFileAsJSON(testFilePath);
      assert.strictEqual(result.totalLines, 3);
    });

    it('should have content property', () => {
      const result = readFileAsJSON(testFilePath);
      assert.ok(result.content);
      assert.ok(result.content.includes('Line 1'));
    });

    it('should return null for non-existent file', () => {
      const result = readFileAsJSON('/nonexistent/file.txt');
      assert.strictEqual(result, null);
    });

    it('should handle empty files', () => {
      const emptyFile = path.join(testDir, 'empty.txt');
      fs.writeFileSync(emptyFile, '');
      const result = readFileAsJSON(emptyFile);
      assert.ok(result);
    });
  });

  // ============================================
  // readCSVAsJSON Tests
  // ============================================
  describe('readCSVAsJSON()', () => {
    let csvFilePath;

    beforeEach(() => {
      csvFilePath = path.join(testDir, 'test.csv');
      const csvContent = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      fs.writeFileSync(csvFilePath, csvContent);
    });

    it('should convert CSV to JSON array', () => {
      const result = readCSVAsJSON(csvFilePath, true);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
    });

    it('should parse CSV headers correctly', () => {
      const result = readCSVAsJSON(csvFilePath, true);
      assert.ok(result[0].name);
      assert.ok(result[0].age);
      assert.ok(result[0].city);
    });

    it('should have correct CSV data', () => {
      const result = readCSVAsJSON(csvFilePath, true);
      assert.strictEqual(result[0].name, 'John');
      assert.strictEqual(result[0].age, '25');
      assert.strictEqual(result[0].city, 'NYC');
      assert.strictEqual(result[1].name, 'Jane');
    });

    it('should handle CSV without header', () => {
      const result = readCSVAsJSON(csvFilePath, false);
      assert.ok(Array.isArray(result));
      assert.ok(result[0].row);
      assert.ok(result[0].data);
    });

    it('should return null for non-existent CSV', () => {
      const result = readCSVAsJSON('/nonexistent/file.csv', true);
      assert.strictEqual(result, null);
    });

    it('should handle single row CSV', () => {
      const singleRowCsv = path.join(testDir, 'single.csv');
      fs.writeFileSync(singleRowCsv, 'name,age\nAlice,28');
      const result = readCSVAsJSON(singleRowCsv, true);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, 'Alice');
    });
  });

  // ============================================
  // readJSONFile Tests
  // ============================================
  describe('readJSONFile()', () => {
    let jsonFilePath;

    beforeEach(() => {
      jsonFilePath = path.join(testDir, 'test.json');
      const jsonData = { name: 'John', age: 25, city: 'NYC' };
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));
    });

    it('should read and parse JSON file', () => {
      const result = readJSONFile(jsonFilePath);
      assert.ok(result);
      assert.strictEqual(result.name, 'John');
      assert.strictEqual(result.age, 25);
    });

    it('should handle valid JSON structure', () => {
      const result = readJSONFile(jsonFilePath);
      assert.strictEqual(typeof result, 'object');
      assert.ok(result.name);
      assert.ok(result.age);
    });

    it('should return null for invalid JSON', () => {
      const invalidJson = path.join(testDir, 'invalid.json');
      fs.writeFileSync(invalidJson, '{invalid json}');
      const result = readJSONFile(invalidJson);
      assert.strictEqual(result, null);
    });

    it('should return null for non-existent file', () => {
      const result = readJSONFile('/nonexistent/file.json');
      assert.strictEqual(result, null);
    });

    it('should handle JSON arrays', () => {
      const arrayJson = path.join(testDir, 'array.json');
      const jsonArray = [{ id: 1 }, { id: 2 }];
      fs.writeFileSync(arrayJson, JSON.stringify(jsonArray));
      const result = readJSONFile(arrayJson);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
    });
  });

  // ============================================
  // readFileAsJSONAsync Tests
  // ============================================
  describe('readFileAsJSONAsync()', () => {
    let asyncTestFile;

    beforeEach(() => {
      asyncTestFile = path.join(testDir, 'async-test.txt');
      fs.writeFileSync(asyncTestFile, 'Async Line 1\nAsync Line 2');
    });

    it('should read file asynchronously', async () => {
      const result = await readFileAsJSONAsync(asyncTestFile);
      assert.ok(result);
      assert.ok(result.data);
      assert.strictEqual(result.data.length, 2);
    });

    it('should include file metadata', async () => {
      const result = await readFileAsJSONAsync(asyncTestFile);
      assert.ok(result.fileName);
      assert.ok(result.filePath);
      assert.ok(result.lineCount);
      assert.ok(result.timestamp);
    });

    it('should have correct lineCount', async () => {
      const result = await readFileAsJSONAsync(asyncTestFile);
      assert.strictEqual(result.lineCount, 2);
    });

    it('should have ISO timestamp', async () => {
      const result = await readFileAsJSONAsync(asyncTestFile);
      assert.ok(result.timestamp);
      assert.ok(result.timestamp.includes('T'));
      assert.ok(result.timestamp.includes('Z'));
    });

    it('should return null for non-existent file', async () => {
      const result = await readFileAsJSONAsync('/nonexistent/file.txt');
      assert.strictEqual(result, null);
    });
  });

  // ============================================
  // saveJSONToFile Tests
  // ============================================
  describe('saveJSONToFile()', () => {
    it('should save JSON object to file', () => {
      const outputFile = path.join(testDir, 'output.json');
      const testData = { name: 'Test', value: 123 };
      
      const result = saveJSONToFile(testData, outputFile);
      
      assert.strictEqual(result, true);
      assert.ok(fs.existsSync(outputFile));
    });

    it('should write valid JSON', () => {
      const outputFile = path.join(testDir, 'valid-output.json');
      const testData = { key: 'value', nested: { data: 'test' } };
      
      saveJSONToFile(testData, outputFile);
      const fileContent = fs.readFileSync(outputFile, 'utf8');
      const parsed = JSON.parse(fileContent);
      
      assert.strictEqual(parsed.key, 'value');
      assert.strictEqual(parsed.nested.data, 'test');
    });

    it('should save JSON array', () => {
      const outputFile = path.join(testDir, 'array-output.json');
      const testArray = [{ id: 1 }, { id: 2 }];
      
      saveJSONToFile(testArray, outputFile);
      const fileContent = fs.readFileSync(outputFile, 'utf8');
      const parsed = JSON.parse(fileContent);
      
      assert.ok(Array.isArray(parsed));
      assert.strictEqual(parsed.length, 2);
    });

    it('should format JSON with indentation', () => {
      const outputFile = path.join(testDir, 'formatted.json');
      const testData = { a: 1, b: 2 };
      
      saveJSONToFile(testData, outputFile);
      const fileContent = fs.readFileSync(outputFile, 'utf8');
      
      // Check if file has proper formatting (spaces/indentation)
      assert.ok(fileContent.includes('\n'));
    });

    it('should handle empty objects', () => {
      const outputFile = path.join(testDir, 'empty-object.json');
      const testData = {};
      
      const result = saveJSONToFile(testData, outputFile);
      
      assert.strictEqual(result, true);
      assert.ok(fs.existsSync(outputFile));
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe('Integration Tests', () => {
    it('should read text file and save as JSON', () => {
      const inputFile = path.join(testDir, 'input.txt');
      const outputFile = path.join(testDir, 'integration-output.json');
      
      fs.writeFileSync(inputFile, 'Test Line 1\nTest Line 2');
      const jsonData = readFileAsJSON(inputFile);
      const saved = saveJSONToFile(jsonData, outputFile);
      
      assert.strictEqual(saved, true);
      const retrievedData = readJSONFile(outputFile);
      assert.ok(retrievedData.lines);
      assert.strictEqual(retrievedData.lines.length, 2);
    });

    it('should convert CSV to JSON and save', () => {
      const csvFile = path.join(testDir, 'integration.csv');
      const outputFile = path.join(testDir, 'csv-output.json');
      
      fs.writeFileSync(csvFile, 'id,name\n1,Alice\n2,Bob');
      const csvData = readCSVAsJSON(csvFile, true);
      const saved = saveJSONToFile(csvData, outputFile);
      
      assert.strictEqual(saved, true);
      const retrievedData = readJSONFile(outputFile);
      assert.strictEqual(retrievedData.length, 2);
    });
  });
});
