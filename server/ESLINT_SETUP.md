# ESLint Setup for Phela Healthcare API

This document explains the ESLint configuration and usage for the Phela Healthcare API project.

## Overview

ESLint is a static code analysis tool for identifying problematic patterns in JavaScript and TypeScript code. It helps maintain code quality, consistency, and can prevent certain types of bugs.

## Configuration

The project uses the new ESLint flat config format in `eslint.config.js`. This configuration includes:

1. **TypeScript Support**: Using `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` for TypeScript-specific linting.
2. **Import Rules**: Using `eslint-plugin-import` to validate proper imports.
3. **Prettier Integration**: Using `eslint-config-prettier` to avoid conflicts with Prettier formatting.

## Key Rules

The ESLint configuration includes the following key rules:

### General Rules
- **Console Statements**: Warns when using `console` methods, but allows `log`, `warn`, `error`, and `info` for backend development.
- **Unused Variables**: Warns about unused variables, but allows variables and parameters prefixed with underscore (`_`).
- **Regular Expressions**: Warns about unnecessary escape characters in regular expressions.

### TypeScript-Specific Rules
- **Explicit Return Types**: Turned off to ease migration, but can be enabled later for better type safety.
- **Any Type**: Warns when using the `any` type to encourage more specific typing.
- **Non-null Assertions**: Warns when using non-null assertions (`!`).
- **Require Statements**: Errors when using CommonJS `require()` statements instead of ES6 imports.

### Import Rules
- **Import Order**: Warns when imports are not properly ordered (built-in, external, internal, etc.).
- **Import Resolution**: Errors when imports cannot be resolved.

## Usage

The following npm scripts are available for linting:

```bash
# Lint all files
yarn lint

# Lint and automatically fix all files
yarn lint:fix

# Lint only TypeScript files
yarn lint:ts

# Lint and automatically fix only TypeScript files
yarn lint:ts:fix
```

## Recommended Workflow

1. **During Development**: Run `yarn lint:ts` regularly to check for issues.
2. **Before Committing**: Run `yarn lint:ts:fix` to automatically fix issues.
3. **For Major Refactoring**: Consider running `yarn lint:fix` to fix issues across all files.

## IDE Integration

For the best development experience, configure your IDE to use ESLint:

### VS Code
1. Install the ESLint extension
2. Add the following to your settings.json:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
```

### WebStorm/IntelliJ IDEA
1. Go to Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
2. Enable ESLint and set the configuration file to `eslint.config.js`

## Customizing Rules

If you need to adjust the ESLint rules for your specific needs:

1. Edit the `eslint.config.js` file
2. Modify the rules section to add, remove, or change rule settings
3. Run `yarn lint:ts` to verify your changes

## Ignoring Files

The configuration already ignores common files and directories like:
- `node_modules`
- `dist` and `build` directories
- Coverage reports
- Log files
- Temporary files
- Environment files

If you need to ignore additional files, add them to the `ignores` array in `eslint.config.js`.