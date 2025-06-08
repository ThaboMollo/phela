import React from 'react';
import ResourceList from '../../components/ResourceList';

const Facilities: React.FC = () => {
  // Define columns for the facilities table
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Type',
      accessor: 'status', // Using status field as a placeholder for facility type
      render: (item: any) => {
        // Just for demo purposes, we'll derive a facility type from the status
        const typeMap: Record<string, string> = {
          Active: 'Hospital',
          Pending: 'Clinic',
          Inactive: 'Laboratory',
        };
        
        return typeMap[item.status] || 'Other';
      },
    },
    {
      header: 'Address',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        return `123 Healthcare St, Medical District, City ${item.id}`;
      },
    },
    {
      header: 'Contact',
      accessor: 'email',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        return item.email || 'contact@facility.com';
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: any) => {
        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Inactive: 'bg-red-100 text-red-800',
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
      title="Facilities"
      endpoint="/admin/v1/facilities"
      resourceName="Facility"
      columns={columns}
    />
  );
};

export default Facilities;