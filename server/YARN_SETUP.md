# Yarn Setup for Phela Healthcare API

This document explains how to use Yarn as the package manager for the Phela Healthcare API project.

## Changes Made

The following changes were made to configure the project to use Yarn:

1. Added a `.yarnrc.yml` file with the following configuration:
   ```yaml
   nodeLinker: node-modules
   ```

2. Generated a proper `yarn.lock` file by running `yarn install`.

3. Removed `package-lock.json` to avoid inconsistencies between package managers.

4. Updated `package.json` scripts to include Yarn-specific commands:
   ```json
   "scripts": {
     "start": "node dist/index.js",
     "dev": "nodemon --exec ts-node src/index.ts",
     "build": "tsc",
     "test": "echo \"Error: no test specified\" && exit 1",
     "setup": "yarn",
     "clean": "rm -rf node_modules dist"
   }
   ```

## Using Yarn

### Installation

If you haven't installed Yarn yet, you can install it globally using npm:

```bash
npm install -g yarn
```

### Project Setup

To set up the project using Yarn, run:

```bash
yarn setup
```

This will install all dependencies specified in `package.json`.

### Development

To run the project in development mode:

```bash
yarn dev
```

### Building

To build the TypeScript code:

```bash
yarn build
```

### Starting the Application

To start the application:

```bash
yarn start
```

### Cleaning

To clean the project (remove node_modules and dist directories):

```bash
yarn clean
```

### Adding Dependencies

To add a new dependency:

```bash
yarn add <package-name>
```

To add a development dependency:

```bash
yarn add --dev <package-name>
```

### Removing Dependencies

To remove a dependency:

```bash
yarn remove <package-name>
```

## Troubleshooting

If you encounter any issues with Yarn, try the following:

1. Clear Yarn's cache:
   ```bash
   yarn cache clean
   ```

2. Remove the node_modules directory and reinstall dependencies:
   ```bash
   yarn clean
   yarn setup
   ```

3. Check for outdated dependencies:
   ```bash
   yarn outdated
   ```

## Note on TypeScript Errors

The project currently has TypeScript errors that need to be fixed before it can be built successfully. These errors are related to type definitions and imports in the TypeScript files. Fixing these errors is beyond the scope of this document, but they need to be addressed before the project can be built and run successfully.