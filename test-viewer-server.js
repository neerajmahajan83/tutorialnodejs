const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = 4000;

app.use(express.static('public'));
app.use(express.json());

/**
 * GET / - Main test dashboard
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * GET /api/tests - Run tests and return JSON results
 */
app.get('/api/tests', (req, res) => {
  const { spawn } = require('child_process');
  
  // Use spawn to capture only the JSON output on stdout
  const mocha = spawn('npx', ['mocha', '--reporter', 'json', 'test/test-*.js'], {
    cwd: '/workspaces/tutorialnodejs',
    stdio: ['ignore', 'pipe', 'pipe']  // ignore stdin, pipe stdout and stderr
  });
  
  let jsonOutput = '';
  let errorOutput = '';
  
  mocha.stdout.on('data', (data) => {
    jsonOutput += data.toString();
  });
  
  mocha.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  mocha.on('close', (code) => {
    try {
      const testResults = JSON.parse(jsonOutput);
      
      res.json({
        success: true,
        tests: testResults.tests,
        passes: testResults.stats.passes,
        failures: testResults.stats.failures,
        pending: testResults.stats.pending,
        duration: testResults.stats.duration,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: 'Failed to parse test results',
        details: e.message
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    Mocha Test Viewer (Browser)         ║
╠════════════════════════════════════════╣
║  Server: http://localhost:${PORT}         ║
║                                        ║
║  Open in browser to see test results   ║
╚════════════════════════════════════════╝
  `);
  console.log(`\n🌐 Visit: http://localhost:${PORT}`);
  console.log(`\n📊 Test API: http://localhost:${PORT}/api/tests\n`);
});
