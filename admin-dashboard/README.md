# Healthcare Admin Dashboard

A React TypeScript admin dashboard for managing healthcare data, built with Material Tailwind, React Router, and Redux.

## Features

- **Authentication**: Secure login system with JWT token-based authentication
- **Dashboard Overview**: Visual summary of key metrics
- **Resource Management**: CRUD operations for:
  - Users
  - Appointments
  - Consultations
  - Facilities
  - Medical Profiles
  - Prescriptions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Material Tailwind components

## Tech Stack

- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **Redux Toolkit**: State management
- **React Router**: Navigation and routing
- **Material Tailwind**: UI components and styling
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: API requests
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (default: http://localhost:5187)

### Installation

1. Navigate to the admin-dashboard directory:
   ```
   cd admin-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the admin-dashboard directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5187
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Additional Scripts

- **Build for production**:
  ```
  npm run build
  # or
  yarn build
  ```

- **Preview production build**:
  ```
  npm run preview
  # or
  yarn preview
  ```

- **Lint code**:
  ```
  npm run lint
  # or
  yarn lint
  ```

- **Fix linting issues**:
  ```
  npm run lint:fix
  # or
  yarn lint:fix
  ```

- **Format code with Prettier**:
  ```
  npm run format
  # or
  yarn format
  ```

## Usage

1. Log in with your admin credentials
2. Navigate through the sidebar to access different resources
3. View, create, edit, and manage healthcare data

## Project Structure

```
admin-dashboard/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # Dashboard pages
│   ├── store/              # Redux store
│   │   └── slices/         # Redux slices
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── .eslintrc.cjs           # ESLint configuration
├── .gitignore              # Git ignore file
├── .prettierrc             # Prettier configuration
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node.js TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Connecting to the API

The dashboard is designed to connect to the Healthcare API running at the URL specified in the `REACT_APP_API_URL` environment variable. Make sure the API is running and accessible before using the dashboard.

## Development Notes

### Migration from Create React App to Vite

This project was migrated from Create React App (CRA) to Vite for faster development and build times. Key changes include:

- Replaced react-scripts with Vite
- Moved index.html from public/ to the root directory
- Updated environment variable handling (still using REACT_APP_ prefix for compatibility)
- Updated TypeScript configuration for Vite compatibility

### Code Quality Tools

The project uses the following tools for code quality:

- **ESLint**: For static code analysis and enforcing coding standards
- **Prettier**: For consistent code formatting
- **TypeScript**: For type checking

### Performance Benefits

Vite provides several performance benefits over Create React App:

- Faster development server startup
- Instant hot module replacement (HMR)
- Optimized production builds
- No need for ejecting to customize configuration

### Notes

- This is a demo application with mock data for demonstration purposes
- In a production environment, you would connect to real API endpoints
