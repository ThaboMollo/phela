import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from '@material-tailwind/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface DashboardStat {
  title: string;
  count: number;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: 'Users', count: 0, path: '/dashboard/users', color: 'blue' },
    { title: 'Appointments', count: 0, path: '/dashboard/appointments', color: 'green' },
    { title: 'Consultations', count: 0, path: '/dashboard/consultations', color: 'orange' },
    { title: 'Facilities', count: 0, path: '/dashboard/facilities', color: 'purple' },
    { title: 'Medical Profiles', count: 0, path: '/dashboard/medical-profiles', color: 'red' },
    { title: 'Prescriptions', count: 0, path: '/dashboard/prescriptions', color: 'teal' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth || {});
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5187';

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        setError('No authentication token found. Please log in again.');
        return;
      }
      setLoading(true);
      setError(null);
      
      try {
        // Simulating API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, you would fetch this from your API
        const updatedStats = [
          { title: 'Users', count: 24, path: '/dashboard/users', color: 'blue' as const },
          { title: 'Appointments', count: 156, path: '/dashboard/appointments', color: 'green' as const },
          { title: 'Consultations', count: 89, path: '/dashboard/consultations', color: 'orange' as const },
          { title: 'Facilities', count: 12, path: '/dashboard/facilities', color: 'purple' as const },
          { title: 'Medical Profiles', count: 78, path: '/dashboard/medical-profiles', color: 'red' as const },
          { title: 'Prescriptions', count: 103, path: '/dashboard/prescriptions', color: 'teal' as const },
        ];
        
        setStats(updatedStats);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [token]);

  const getCardColorClass = (color: DashboardStat['color']) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-500',
      green: 'bg-green-50 text-green-500',
      orange: 'bg-orange-50 text-orange-500',
      purple: 'bg-purple-50 text-purple-500',
      red: 'bg-red-50 text-red-500',
      teal: 'bg-teal-50 text-teal-500',
    };
    
    return colorMap[color];
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-red-500 text-lg font-semibold">
          No authentication token found. Please log in again.
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        {(
          <Typography variant="h3" color="blue-gray" className="mb-2" as={"div" as any}>
            Dashboard
          </Typography>
        )}
        {(
          <Typography color="gray" className="font-normal" as={"div" as any}>
            Overview of your healthcare system
          </Typography>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-blue-500 text-lg font-semibold">Loading...</span>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats && stats.length > 0 ? (
              stats.map((stat) => (
                (
                  <Card key={stat.title} className="overflow-hidden" as={"div" as any}>
                    <CardBody className={`${getCardColorClass(stat.color)} p-6`} as={"div" as any}>
                      <Typography 
                          variant="h5" className="mb-2 font-bold" 
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" className="font-bold" as={"div" as any}>
                        {stat.count}
                      </Typography>
                    </CardBody>
                    <CardFooter className="pt-0" as={"div" as any}>
                      <Link to={stat.path}>
                        <Button
                          size="sm"
                          variant="text"
                          className="flex items-center gap-2"
                          as={"button" as any}
                        >
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                          </svg>
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ) as any
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 p-4 text-center">
                <Typography color="gray" className="font-normal" as={"div" as any}>
                  No statistics available at the moment.
                </Typography>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;