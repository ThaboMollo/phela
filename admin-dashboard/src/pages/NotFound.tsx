import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <Typography variant="h1" className="text-9xl font-bold text-blue-500">
          404
        </Typography>
        <Typography variant="h4" className="mt-4 mb-6 text-gray-800">
          Page Not Found
        </Typography>
        <Typography className="mb-8 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Link to="/dashboard">
          <Button variant="gradient" color="blue" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;