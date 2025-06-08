import React from 'react';
import ResourceList from '../../components/ResourceList';

const Users: React.FC = () => {
  // Define columns for the users table
  const columns = [
    {
      header: 'ID',
      accessor: '_id',
    },
    {
      header: 'Name',
      accessor: 'full_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
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
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (item: any) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <ResourceList
      title="Users"
      endpoint="/admin/v1/users"
      resourceName="User"
      columns={columns}
    />
  );
};

export default Users;