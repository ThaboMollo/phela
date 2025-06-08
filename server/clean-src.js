/**
 * This script removes all .js files from the src directory and its subdirectories.
 * These files are TypeScript compilation artifacts that should be in the dist directory.
 */

const fs = require('fs');
const path = require('path');

// Function to recursively remove .js files from a directory
function removeJsFiles(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      removeJsFiles(itemPath);
    } else if (stats.isFile() && item.endsWith('.js')) {
      // Remove .js files
      console.log(`Removing: ${itemPath}`);
      fs.unlinkSync(itemPath);
    }
  }
}

// Start the cleanup process from the src directory
const srcDir = path.join(__dirname, 'src');
console.log(`Cleaning .js files from ${srcDir}...`);
removeJsFiles(srcDir);
console.log('Cleanup complete!');