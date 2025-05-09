import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
//import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MeasuringUnitDropdown from './MeasuringUnitDropdown';
import GstTaxRate from './GSTTaxRateDropdown';
import GodownDropdown from '../GodownDropdown';
import DateField from './DateField';
import LowStockWarning from './LowStockWarning';
import ImageUploadField from './ImageUploadField';
import HSNCodeField from './HSNCodeField';

interface Category {
  id: number;
  name: string;
}

interface CategoryApiResponse {
  results: Category[];
}

interface ProductFormData {
  itemName: string;
  salesPrice: string;
  salesPriceType: string;
  purchasePrice: string;
  purchasePriceType: string;
  itemCode: string;
  itemBatch: string;
  description: string;
  openingStock: string;
  measuringUnit: string;
  gstTaxRate: string;
  godown: string;
  date: string;
  lowStockWarning: boolean;
  lowStockQty: string;
  hsnCode: string;
  item_image: File | string;
}

const ProductForm = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  // const [selectedCategory, setSelectedCategory] = useState('');
  const [itemCategory, setItemCategory] = useState<string | number>('');

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    itemName: '',
    salesPrice: '',
    salesPriceType: 'With Tax', // Default value
    purchasePrice: '',
    purchasePriceType: 'With Tax', // Default value
    itemCode: '',
    itemBatch: '',
    description: '',
    openingStock: '',
    measuringUnit: '',
    gstTaxRate: '',
    godown: '',
    date: '',
    lowStockWarning: false,
    lowStockQty: '',
    hsnCode: '',
    item_image: '',
  });

  // Fetch categories from API when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response: AxiosResponse<CategoryApiResponse> = await axios.get(
        `${API_URL}/inventory/categories/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (data && Array.isArray(data.results)) {
        setCategories(data.results); // Update categories with the results array
      } else {
        throw new Error('Invalid data format');
      } // Assuming API returns an array of categories
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

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ Prevent page refresh immediately

    if (!newCategory.trim()) {
      alert('Please enter a valid category.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response: AxiosResponse = await axios.post(
        `${API_URL}/inventory/categories/`,
        { name: newCategory.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log('Response from API:', data); // Debugging

      if (response.status === 201 || response.status === 200) {
        setNewCategory('');
        setIsCreatingCategory(false);
        await fetchCategories(); // ✅ Re-fetch categories from API to update dropdown
      } else {
        console.error('Error adding category:', data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('salesPrice', formData.salesPrice);
      formDataToSend.append('category', String(itemCategory));
      formDataToSend.append('salesPriceType', formData.salesPriceType);
      formDataToSend.append('purchasePrice', formData.purchasePrice);
      formDataToSend.append('purchasePriceType', formData.purchasePriceType);
      formDataToSend.append('itemCode', formData.itemCode);
      formDataToSend.append('itemBatch', formData.itemBatch);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('openingStock', formData.openingStock);
      formDataToSend.append('measuringUnit', formData.measuringUnit);
      formDataToSend.append('gstTaxRate', formData.gstTaxRate);
      formDataToSend.append('godown', formData.godown);
      formDataToSend.append('date', formData.date);
      formDataToSend.append(
        'lowStockWarning',
        formData.lowStockWarning ? 'true' : 'false',
      );
      formDataToSend.append('lowStockQty', formData.lowStockQty);
      formDataToSend.append('hsnCode', formData.hsnCode);

      // Append image file if it exists and is a File
      if (formData.item_image && formData.item_image instanceof File) {
        formDataToSend.append('item_image', formData.item_image);
      }

      const response: AxiosResponse = await axios.post(
        `${API_URL}/inventory/items/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type' is automatically set to multipart/form-data by Axios when using FormData
          },
        }
      );

      const data = response.data;

      if (response.status === 201 || response.status === 200) {
        alert('Product saved successfully!');
        setFormData({
          itemName: '',
          salesPrice: '',
          salesPriceType: 'With Tax',
          purchasePrice: '',
          purchasePriceType: 'With Tax',
          itemCode: '',
          itemBatch: '',
          description: '',
          openingStock: '',
          measuringUnit: '',
          gstTaxRate: '',
          godown: '',
          date: '',
          lowStockWarning: false,
          lowStockQty: '',
          hsnCode: '',
          item_image: '', // Reset the image
        });
        setItemCategory('');
      } else {
        console.error('Error saving product:', data);
        alert('Error saving product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save product.');
    }
  };

  return (
    <>
      {/*<Breadcrumb pageName="Create Items" />*/}

      <div className="w-full flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Basic Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Item name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Enter your first name"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Sales Price
                </label>
                <div className="flex gap-2">
                  {/* Opening Balance Input */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="salesPrice"
                      placeholder="0"
                      value={formData.salesPrice}
                      onChange={handleInputChange}
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Dropdown for "With Tax / Without Tax" */}
                  <select
                    name="salesPriceType"
                    value={formData.salesPriceType}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="With Tax">With Tax</option>
                    <option value="Without Tax">Without Tax</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Purchase Price
                </label>
                <div className="flex gap-2">
                  {/* Opening Balance Input */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="purchasePrice"
                      placeholder="0"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Dropdown for "With Tax / Without Tax" */}
                  <select
                    name="purchasePriceType"
                    value={formData.purchasePriceType}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="With Tax">With Tax</option>
                    <option value="Without Tax">Without Tax</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <GstTaxRate
                    value={formData.gstTaxRate}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, gstTaxRate: value }))
                    }
                  />
                </div>
                <div className="w-full xl:w-1/3">
                  <MeasuringUnitDropdown
                    value={formData.measuringUnit}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, measuringUnit: value }))
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

              {/* New Section Heading */}
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark mb-6 mt-6">
                <h3 className="font-medium text-black dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="mb-4.5 xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Item Batch
                  </label>
                  <input
                    type="number"
                    name="itemBatch"
                    value={formData.itemBatch}
                    onChange={handleInputChange}
                    placeholder="Enter Item Code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="^[a-zA-Z0-9]+$"
                    title="Item code should contain only letters and numbers"
                  />
                </div>
                <div className="mb-4.5 xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Item Code
                  </label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleInputChange}
                    placeholder="Enter Item Code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="^[a-zA-Z0-9]+$"
                    title="Item code should contain only letters and numbers"
                  />
                </div>
                <HSNCodeField
                  value={formData.hsnCode}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, hsnCode: value }))
                  }
                />
                <div className="mb-4.5 xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Opening Stock
                  </label>
                  <input
                    type="number"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleInputChange}
                    placeholder="Enter Opening Stocks"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:gap-4">
                <GodownDropdown
                  value={formData.godown}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, godown: value }))
                  }
                />
                <DateField
                  value={formData.date}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, date: value }))
                  }
                />
              </div>
              <LowStockWarning
                value={formData.lowStockQty}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, lowStockQty: value }))
                }
              />

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Description */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter Description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <ImageUploadField
                value={formData.item_image}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, item_image: value }))
                }
              />

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </form>
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
        </div>
      </div>
    </>
  );
};

export default ProductForm;
