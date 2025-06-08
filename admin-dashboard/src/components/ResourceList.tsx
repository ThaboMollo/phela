import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ResourceListProps {
  title: string;
  endpoint: string;
  resourceName: string;
  columns: {
    header: string;
    accessor: string;
    render?: (item: any) => React.ReactNode;
    inputType?: string; // e.g. 'text', 'email', 'password', etc.
    hideInForm?: boolean; // for fields like id
  }[];
  formFields?: {
    accessor: string;
    inputType?: string;
    label?: string;
    hide?: boolean;
  }[];
  validate?: (formData: any) => string | null;
}

const ResourceList: React.FC<ResourceListProps> = ({
  title,
  endpoint,
  resourceName,
  columns,
  formFields,
  validate,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5187';

  // Fetch data function for reuse
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setItems(response.data.data || []);
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${resourceName.toLowerCase()}`);
      setItems([]);
      console.error(`Error fetching ${resourceName.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(items)
  }, [items]);
  useEffect(() => {
    fetchData();
  }, [token, resourceName, endpoint]);

  // CRUD Handlers
  const handleAdd = () => {
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: any) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const closeDetails = () => {
    setIsDetailOpen(false);
    setSelectedItem(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    if (validate) {
      const validationError = validate(formData);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    try {
      if (formData.id) {
        // Update
        await axios.put(`${API_URL}${endpoint}/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create
        await axios.post(`${API_URL}${endpoint}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || `Failed to save ${resourceName.toLowerCase()}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await axios.delete(`${API_URL}${endpoint}/${deleteItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleteOpen(false);
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || `Failed to delete ${resourceName.toLowerCase()}`);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            {title}
          </Typography>
          <Typography color="gray" className="font-normal">
            Manage your {resourceName.toLowerCase()}
          </Typography>
        </div>
        <Button color="blue" onClick={handleAdd}>Add {resourceName}</Button>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-500">
          {error}
        </div>
      )}
      
      <Card className="overflow-hidden">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-4 bg-blue-gray-50"
        >
          <Typography variant="h5" color="blue-gray">
            {resourceName} List
          </Typography>
        </CardHeader>
        <CardBody className="px-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner className="h-12 w-12" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex justify-center items-center p-8 text-gray-500">
              No {resourceName.toLowerCase()} data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {console.log(columns)}
                    {columns.map((column) => (
                      <th
                        key={column.accessor}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          {column.header}
                        </Typography>
                      </th>
                    ))}
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none opacity-70"
                      >
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    items.length > 0 
                        ?
                    items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-blue-gray-50/50' : ''}>
                        {columns.map((column) => (
                          <td key={`${item.id}-${column.accessor}`} className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {column.render
                                ? column.render(item)
                                : item[column.accessor] || '-'}
                            </Typography>
                          </td>
                        ))}
                        <td className="p-4">
                          <div className="flex gap-2">
                            <IconButton
                              variant="text"
                              color="blue"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
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
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="green"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="red"
                              size="sm"
                              onClick={() => handleDelete(item)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                        : <>No items found</>
                  }
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={isDetailOpen} handler={closeDetails} size="md">
        <DialogHeader>{resourceName} Details</DialogHeader>
        <DialogBody divider children={
          selectedItem 
              ? 
              <div className="grid grid-cols-2 gap-4">
                {columns.map((column) => (
                    <div key={column.accessor} className="mb-2">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {column.header}:
                      </Typography>
                      <Typography variant="small">
                        {column.render
                            ? column.render(selectedItem)
                            : selectedItem[column.accessor] || '-'}
                      </Typography>
                    </div>
                ))}
            </div>
              
            : <></>
        }>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeDetails} className="mr-1">
            Close
          </Button>
          <Button variant="gradient" color="blue" onClick={closeDetails}>
            Edit
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} handler={() => setIsFormOpen(false)} size="md">
        <DialogHeader>{formData.id ? `Edit ${resourceName}` : `Add ${resourceName}`}</DialogHeader>
        <DialogBody divider>
          {(formFields || columns)
            .filter((field) => !(field.hide || field.hideInForm || field.accessor === 'id'))
            .map((field) => (
              <div key={field.accessor} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label || field.header || field.accessor}
                </label>
                <input
                  type={field.inputType || 'text'}
                  name={field.accessor}
                  value={formData[field.accessor] || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsFormOpen(false)} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleFormSubmit}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} handler={() => setIsDeleteOpen(false)} size="xs">
        <DialogHeader>Delete {resourceName}</DialogHeader>
        <DialogBody divider>
          Are you sure you want to delete this {resourceName.toLowerCase()}?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={() => setIsDeleteOpen(false)} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ResourceList;

