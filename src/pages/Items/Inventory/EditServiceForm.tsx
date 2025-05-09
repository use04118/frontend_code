import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeasuringUnitDropdown from '../CreateItemLayoutForm/MeasuringUnitDropdown';
import GstTaxRate from '../CreateItemLayoutForm/GSTTaxRateDropdown';
import SACCodeField from '../CreateItemLayoutForm/SACCodeField';

interface Category {
  id: number;
  name: string;
}

interface EditedItem {
  serviceName: string;
  salesPrice: string;
  salesPriceType: string;
  serviceCode: string;
  gstTaxRate: string;
  measuringUnit: string;
  sacCode: string;
  description: string;
}

interface EditServiceFormProps {
  editedItem: EditedItem;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSaveClick: () => void;
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({
  editedItem,
  handleInputChange,
  handleSaveClick,
}) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [itemCategory, setItemCategory] = useState<string | number>('');

  // State to store form data (not used directly, but kept for reference)
  const [formData, setFormData] = useState<EditedItem>({
    serviceName: '',
    salesPrice: '',
    salesPriceType: 'With Tax',
    serviceCode: '',
    gstTaxRate: '',
    measuringUnit: '',
    sacCode: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<{ results: Category[] }>(
        `${API_URL}/inventory/categories/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.results)) {
        setCategories(response.data.results);
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
    } else {
      setItemCategory(value);
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
        }
      );

      console.log('Response from API:', response.data);

      if (response.status === 201 || response.status === 200) {
        setNewCategory('');
        setIsCreatingCategory(false);
        await fetchCategories();
      } else {
        console.error('Error adding category:', response.data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-9">
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Basic Details
            </h3>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Service name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={editedItem.serviceName}
                    onChange={handleInputChange}
                    placeholder="Enter service name"
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4.5 xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Service Code
                  </label>
                  <input
                    type="text"
                    name="serviceCode"
                    value={editedItem.serviceCode}
                    onChange={handleInputChange}
                    placeholder="Enter Item Code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="^[a-zA-Z0-9]+$"
                    title="Item code should contain only letters and numbers"
                  />
                </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Sales Price
                </label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="salesPrice"
                      value={editedItem.salesPrice}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <select
                    name="salesPriceType"
                    value={editedItem.salesPriceType}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="With Tax">With Tax</option>
                    <option value="Without Tax">Without Tax</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <GstTaxRate
                    value={editedItem.gstTaxRate}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, gstTaxRate: value }))
                    }
                  />
                </div>
                <div className="w-full xl:w-1/3">
                  <MeasuringUnitDropdown
                    value={
                      editedItem.measuringUnit === '' || isNaN(Number(editedItem.measuringUnit))
                        ? null
                        : Number(editedItem.measuringUnit)
                    }
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, measuringUnit: String(value) }))
                    }
                  />
                </div>
                {/* Party Category*/}
                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={itemCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
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

              {/* Popup Modal for Creating Category*/}
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
              <div className="mb-4.5">
                <SACCodeField
                  value={editedItem.sacCode}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, sacCode: value }))
                  }
                />
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Description */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={editedItem.description}
                    onChange={handleInputChange}
                    placeholder="Enter Description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditServiceForm;
