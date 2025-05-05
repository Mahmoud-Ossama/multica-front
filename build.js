const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Delete package-lock.json if it exists
const lockFilePath = path.join(__dirname, 'package-lock.json');
if (fs.existsSync(lockFilePath)) {
  console.log('Removing package-lock.json...');
  fs.unlinkSync(lockFilePath);
}

// Install dependencies
console.log('Installing dependencies without lock file...');
execSync('npm install --no-package-lock', { stdio: 'inherit' });

// Build the project
console.log('Building the project...');
execSync('npx react-scripts build', { stdio: 'inherit' });
