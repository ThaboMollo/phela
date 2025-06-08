import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
            Healthcare Admin Dashboard
          </Typography>
          <Outlet />
        </CardBody>
      </Card>
    </div>
  );
};

export default AuthLayout;