import React from 'react';
import ResourceList from '../../components/ResourceList';

const Appointments: React.FC = () => {
  // Define columns for the appointments table
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
    },
    {
      header: 'Patient',
      accessor: 'name',
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (item: any) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      header: 'Time',
      accessor: 'createdAt',
      render: (item: any) => {
        const date = new Date(item.createdAt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: any) => {
        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Cancelled: 'bg-red-100 text-red-800',
          Completed: 'bg-blue-100 text-blue-800',
        };
        
        const color = statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {item.status}
          </span>
        );
      },
    },
  ];

  return (
    <ResourceList
      title="Appointments"
      endpoint="/admin/v1/appointments"
      resourceName="Appointment"
      columns={columns}
    />
  );
};

export default Appointments;