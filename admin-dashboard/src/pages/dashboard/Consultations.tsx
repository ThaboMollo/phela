import React from 'react';
import ResourceList from '../../components/ResourceList';

const Consultations: React.FC = () => {
  // Define columns for the consultations table
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
      header: 'Doctor',
      accessor: 'email', // Using email field as a placeholder for doctor name
      render: (item: any) => `Dr. ${item.email.split('@')[0]}`, // Just for demo
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
      header: 'Status',
      accessor: 'status',
      render: (item: any) => {
        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Completed: 'bg-blue-100 text-blue-800',
          Cancelled: 'bg-red-100 text-red-800',
        };
        
        const color = statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {item.status}
          </span>
        );
      },
    },
    {
      header: 'Notes',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        return `Consultation notes for patient ${item.id}`;
      },
    },
  ];

  return (
    <ResourceList
      title="Consultations"
      endpoint="/admin/v1/consultations"
      resourceName="Consultation"
      columns={columns}
    />
  );
};

export default Consultations;