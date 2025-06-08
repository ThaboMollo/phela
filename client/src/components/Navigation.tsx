import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Typography, Button } from '@material-tailwind/react';

const Navigation: React.FC = () => {
  const location = useLocation();
  return (
    <Navbar className="max-w-full rounded-none px-4 py-2 dark:bg-gray-800 dark:text-white" placeholder="">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="cursor-pointer" placeholder="">
          <Link to="/">Phela Health</Link>
        </Typography>
        <div className="flex items-center gap-4">
          <Button
            variant={location.pathname === '/' ? 'filled' : 'text'}
            size="sm"
            placeholder=""
            as={Link}
            to="/"
          >
            Home
          </Button>
          <Button
            variant={location.pathname === '/login' ? 'filled' : 'text'}
            size="sm"
            placeholder=""
            as={Link}
            to="/login"
          >
            Login
          </Button>
        </div>
      </div>
    </Navbar>
  );
};

export default Navigation;

