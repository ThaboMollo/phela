/**
 * This file serves as an entry point for production deployment.
 * It imports the compiled TypeScript code from the dist directory.
 * 
 * For development, use `yarn dev` which runs the TypeScript code directly.
 * For production, first build the project with `yarn build` and then run with `node server.js`.
 */

// Check if the dist directory exists and contains the compiled code
try {
  // Import the compiled app from dist directory
  const app = require('./dist/index');
  console.log('Server started using compiled TypeScript code');
} catch (error) {
  console.error('Error loading compiled code:', error.message);
  console.error('Make sure to build the project with `yarn build` before running in production');
  process.exit(1);
}
