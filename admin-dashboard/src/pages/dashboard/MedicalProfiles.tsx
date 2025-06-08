import React from 'react';
import ResourceList from '../../components/ResourceList';

const MedicalProfiles: React.FC = () => {
  // Define columns for the medical profiles table
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
      header: 'Age',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        return Math.floor(Math.random() * 50) + 20; // Random age between 20-70
      },
    },
    {
      header: 'Blood Type',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const index = parseInt(item.id) % bloodTypes.length;
        return bloodTypes[index];
      },
    },
    {
      header: 'Allergies',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        const allergies = ['None', 'Penicillin', 'Peanuts', 'Lactose', 'Shellfish'];
        const index = parseInt(item.id) % allergies.length;
        return allergies[index];
      },
    },
    {
      header: 'Last Updated',
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
      title="Medical Profiles"
      endpoint="/admin/v1/medical-profiles"
      resourceName="Medical Profile"
      columns={columns}
    />
  );
};

export default MedicalProfiles;