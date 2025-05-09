import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import ItemForm from './ItemForm';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  itemName?: string;
  itemCode?: string;
  serviceName?: string;
  serviceCode?: string;
  category: number;
  closingStock?: number;
  salesPrice_with_tax?: number;
  salesPrice?: number;
  purchasePrice_with_tax?: number;
  purchasePrice?: number;
  itemType?: string;
  serviceType?: string;
  lowStockQty?: number;
  description?: string;
  type: 'item' | 'service';
}

interface EditedItem extends Partial<Item> {}

const ItemsTable = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string | number>('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editedItem, setEditedItem] = useState<EditedItem | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      // Fetch items and services concurrently
      const [itemsResponse, servicesResponse] = await Promise.all([
        axios.get(`${API_URL}/inventory/items/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_URL}/inventory/service/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const itemsData = itemsResponse.data;
      const servicesData = servicesResponse.data;

      // Combine items and services into one list
      const allData: Item[] = [
        ...itemsData.results.map((item: any) => ({ ...item, type: 'item' })),
        ...servicesData.results.map((service: any) => ({
          ...service,
          type: 'service',
        })),
      ];

      console.log('Fetched Data:', allData);

      if (Array.isArray(allData)) {
        setItems(allData);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setItems([]);
    }
  };

  // Filtering items based on search term
  const filteredItems = items.filter(
    (item) =>
      (item.itemName || item.serviceName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? item.category === Number(selectedCategory) : true),
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      console.log('Sending Token:', token);

      const response = await axios.get(`${API_URL}/inventory/categories/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);
      if (data && Array.isArray(data.results)) {
        setCategories(data.results);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true);
      setItemCategory('');
      setSelectedCategory('');
    } else {
      setItemCategory(Number(value));
      setSelectedCategory(value);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      alert('Please enter a valid category.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await axios.post(
        `${API_URL}/inventory/categories/`,
        { name: newCategory.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      console.log('Response from API:', data);

      if (response.status === 201 || response.status === 200) {
        setNewCategory('');
        setIsCreatingCategory(false);
        await fetchCategories();
        setSelectedCategory(data.name);
      } else {
        console.error('Error adding category:', data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  const handleRowClick = async (id: number, type: 'item' | 'service') => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const endpoint =
        type === 'item'
          ? `${API_URL}/inventory/items/${id}/`
          : `${API_URL}/inventory/service/${id}/`;

      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Selected Item Data:', data);

      setSelectedItem({ ...data, type });
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleBackClick = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedItem(selectedItem);
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !selectedItem) throw new Error('Token not found');
      let dname = selectedItem.itemType || selectedItem.serviceType;
      const endpoint =
        selectedItem.itemType === 'Product'
          ? `${API_URL}/inventory/items/${selectedItem.id}/`
          : `${API_URL}/inventory/service/${selectedItem.id}/`;

      const response = await axios.delete(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.status === 200) {
        alert(`${dname} is deleted`);
        setSelectedItem(null);
        fetchData();
      } else {
        console.error('Error deleting item/service:', response.data);
        alert('Failed to delete item/service.');
      }
    } catch (error) {
      console.error('Error deleting item/service:', error);
      alert('An error occurred while deleting.');
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !editedItem) throw new Error('Token not found');
      const endpoint =
        editedItem.itemType === 'Product'
          ? `${API_URL}/inventory/items/${editedItem.id}/`
          : `${API_URL}/inventory/service/${editedItem.id}/`;

      await axios.put(endpoint, editedItem, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false);
      if (editedItem) setSelectedItem(editedItem as Item);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!selectedItem ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Items Details</h2>
            <div className="relative w-1/3">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by Item Name..."
                className="w-full p-3 pl-10 border border-gray-300 dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* 📌 Category Dropdown */}
            <div className="relative w-1/3">
              <select
                className="w-full p-3 border border-gray-300 dark:bg-gray-900
                rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                value={itemCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                <option value="create">Create Category</option>
              </select>
            </div>
          </div>

          {/* Popup Modal for Creating Category */}
          {isCreatingCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-2">
                  Create a New Category
                </h3>
                <form
                  onSubmit={handleCreateCategory}
                  className="flex flex-col space-y-3"
                >
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      onClick={() => setIsCreatingCategory(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <table className="min-w-full border border-gray-300 ">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-gray-600">
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Item Code</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Stock QTY</th>
                <th className="border px-4 py-2">Selling Price</th>
                <th className="border px-4 py-2">Purchase Price</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((data) => (
                  <tr
                    key={`${data.id}-${data.type}-${data.itemCode}`}
                    onClick={() => handleRowClick(data.id, data.type)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="border px-4 py-2">
                      {data.itemName || data.serviceName}
                    </td>
                    <td className="border px-4 py-2">
                      {data.itemCode || data.serviceCode}
                    </td>
                    <td className="border px-4 py-2">
                      {categories.find((cat) => cat.id === data.category)
                        ?.name || 'Unknown'}
                    </td>
                    <td className="border px-4 py-2">
                      {data.closingStock || '0'}
                    </td>
                    <td className="border px-4 py-2">
                      ₹{data.salesPrice_with_tax || data.salesPrice || '0'}
                    </td>
                    <td className="border px-4 py-2">
                      ₹
                      {data.purchasePrice_with_tax || data.purchasePrice || '0'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan="6">
                    No items or services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        // Item Details View
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <div className="relative">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
              onClick={handleBackClick}
            >
              Back
            </button>
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-14 bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
              <FaTrash />
            </button>
            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              <FaEdit />
            </button>
          </div>
          <h3 className="text-xl font-bold">Item Details</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong>{' '}
                {selectedItem.itemName || selectedItem.serviceName}
              </div>
              <div>
                <strong>Code:</strong>{' '}
                {selectedItem.itemCode || selectedItem.serviceCode}
              </div>
              <div>
                <strong>Category:</strong>{' '}
                {categories.find((cat) => cat.id === selectedItem.category)
                  ?.name || 'Not Found'}
              </div>
              <div>
                <strong>Stock QTY:</strong> {selectedItem.lowStockQty || '-'}
              </div>
              <div>
                <strong>Purchase Price:</strong> ₹
                {selectedItem.purchasePrice || '-'}
              </div>
              <div>
                <strong>Selling Price:</strong> ₹
                {selectedItem.salesPrice || '-'}
              </div>
              <div>
                <strong>Description:</strong> {selectedItem.description || '-'}
              </div>
            </div>
          ) : (
            <ItemForm
              editedItem={editedItem}
              handleInputChange={handleInputChange}
              handleSaveClick={handleSaveClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsTable;
