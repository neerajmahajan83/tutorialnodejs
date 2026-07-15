// Suppress console output during test runs with JSON reporter
const originalLog = console.log;
const originalError = console.error;

// Override console methods only when running with JSON reporter
if (process.argv.includes('--reporter') && process.argv.includes('json')) {
  console.log = () => {};
  console.error = () => {};
}
