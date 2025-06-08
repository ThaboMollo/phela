import React from 'react';
import ResourceList from '../../components/ResourceList';

const Prescriptions: React.FC = () => {
  // Define columns for the prescriptions table
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
      header: 'Medication',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        const medications = [
          'Amoxicillin 500mg',
          'Lisinopril 10mg',
          'Atorvastatin 20mg',
          'Metformin 1000mg',
          'Sertraline 50mg',
        ];
        const index = parseInt(item.id) % medications.length;
        return medications[index];
      },
    },
    {
      header: 'Dosage',
      accessor: 'id',
      render: (item: any) => {
        // Just a placeholder for demo purposes
        const dosages = [
          'Once daily',
          'Twice daily',
          'Three times daily',
          'Every 4 hours',
          'As needed',
        ];
        const index = parseInt(item.id) % dosages.length;
        return dosages[index];
      },
    },
    {
      header: 'Date Prescribed',
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
  ];

  return (
    <ResourceList
      title="Prescriptions"
      endpoint="/admin/v1/prescriptions"
      resourceName="Prescription"
      columns={columns}
    />
  );
};

export default Prescriptions;