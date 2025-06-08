import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
} from '@material-tailwind/react';
import { logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import { useDarkMode } from '../hooks/useDarkMode';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const DashboardLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useDarkMode();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/users', label: 'Users' },
    { path: '/dashboard/appointments', label: 'Appointments' },
    { path: '/dashboard/consultations', label: 'Consultations' },
    { path: '/dashboard/facilities', label: 'Facilities' },
    { path: '/dashboard/medical-profiles', label: 'Medical Profiles' },
    { path: '/dashboard/prescriptions', label: 'Prescriptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Top Navbar */}
      <Navbar className="max-w-full rounded-none px-4 py-2 dark:bg-gray-800 dark:text-white" placeholder="">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconButton
              variant="text"
              className="mr-4 lg:hidden"
              onClick={openDrawer}
              placeholder=""
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </IconButton>
            <Typography variant="h6" className="mr-4 cursor-pointer py-1.5" placeholder="">
              Healthcare Admin
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setIsDark((d) => !d)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-800" />
              )}
            </button>
            <Typography variant="small" className="hidden lg:inline-block" placeholder="">
              {user?.name || 'Admin User'}
            </Typography>
            <Button
              variant="gradient"
              size="sm"
              onClick={handleLogout}
              placeholder=""
            >
              Logout
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Sidebar for larger screens */}
      <div className="flex">
        <aside className="hidden lg:block w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4">
          <List placeholder="">
            {navItems.map((item) => (
              <ListItem key={item.path} className="p-0" placeholder="">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center w-full p-3 rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </aside>

        {/* Mobile Drawer */}
        <Drawer open={isDrawerOpen} onClose={closeDrawer} placeholder="">
          <div className="p-4">
            <Typography variant="h5" className="mb-6" placeholder="">
              Healthcare Admin
            </Typography>
            <List placeholder="">
              {navItems.map((item) => (
                <ListItem key={item.path} className="p-0" placeholder="">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center w-full p-3 rounded-lg ${
                        isActive
                          ? 'bg-blue-50 text-blue-500'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={closeDrawer}
                  >
                    <ListItemPrefix placeholder="">
                      <span className="h-5 w-5"></span>
                    </ListItemPrefix>
                    {item.label}
                  </NavLink>
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;