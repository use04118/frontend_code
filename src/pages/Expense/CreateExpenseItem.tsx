import React, { useState, useRef, useEffect, ChangeEvent, FocusEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

interface GSTTaxRateDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

// Types
interface MeasuringUnit {
  id: string;
  name: string;
}

interface TaxRate {
  id: string;
  description: string;
}

interface ItemState {
  itemName: string;
  itemType: 'Product' | 'Service';
  purchasePrice: string;
  purchasePriceType: 'Without Tax' | 'With Tax';
  hsnCode: string;
  ITC: 'Eligible' | 'Ineligible' | 'Ineligible Others';
  measuringUnit: string | null;
  gstTaxRate: string | null;
}

const CreateExpenseItem: React.FC = () => {
  const [measuringUnits, setMeasuringUnits] = useState<MeasuringUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<MeasuringUnit | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<TaxRate | null>(null);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState('');
  const dropdownRef1 = useRef<HTMLDivElement | null>(null);
  const [loading1, setLoading1] = useState(true);
  const [error1, setError1] = useState<string | null>(null);
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemState>({
    itemName: '',
    itemType: 'Product',
    purchasePrice: '',
    purchasePriceType: 'Without Tax',
    hsnCode: '',
    ITC: 'Eligible',
    measuringUnit: null,
    gstTaxRate: null,
  });

  const handleChange = (field: keyof ItemState, value: any) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const endpoint =
        item.itemType === 'Product'
          ? `${API_URL}/expenses/items/`
          : `${API_URL}/expenses/services/`;

      const requestData = {
        ...item,
        ...(item.itemType === 'Service'
          ? {
              sacCode: item.hsnCode,
              hsnCode: undefined,
              measuringUnit: undefined,
              serviceName: item.itemName,
              serviceType: item.itemType,
              itemName: undefined,
              itemType: undefined,
            }
          : {}),
      };

      const response: AxiosResponse = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status < 200 || response.status >= 300) throw new Error('Failed to save item');

      alert('Item created successfully');
      navigate('/Expenses/Create-Expense');
    } catch (error: any) {
      console.error('Error saving item:', error.message);
      alert('Failed to save item');
    }
  };

  useEffect(() => {
    const fetchMeasuringUnits = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        let allUnits: MeasuringUnit[] = [];
        let nextPage: string | null = `${API_URL}/inventory/measuring-units/`;

        while (nextPage) {
          const response: AxiosResponse = await axios.get(nextPage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status < 200 || response.status >= 300) throw new Error('Failed to fetch measuring units');

          const data = response.data;
          allUnits = [...allUnits, ...data.results];
          nextPage = data.next;
        }

        setMeasuringUnits(allUnits);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasuringUnits();
  }, [API_URL]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (unit: MeasuringUnit) => {
    setSelectedUnit(unit);
    handleChange('measuringUnit', unit.id);
    setIsDropdownOpen(false);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }, 200);
  };

  const filteredUnits = measuringUnits.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const fetchTaxRates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        let allRates: TaxRate[] = [];
        let nextPage: string | null = `${API_URL}/inventory/gst-tax-rates/`;

        while (nextPage) {
          const response: AxiosResponse = await axios.get(nextPage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status < 200 || response.status >= 300) throw new Error('Failed to fetch GST tax rates');

          const data = response.data;
          allRates = [...allRates, ...data.results];
          nextPage = data.next;
        }

        setTaxRates(allRates);
      } catch (error: any) {
        setError1(error.message);
      } finally {
        setLoading1(false);
      }
    };

    fetchTaxRates();
  }, [API_URL]);

  const handleInputChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm1(e.target.value);
  };

  const handleSelect1 = (rate: TaxRate) => {
    setSelectedRate(rate);
    handleChange('gstTaxRate', rate.id);
    setIsDropdownOpen1(false);
  };

  const handleBlur1 = (e: FocusEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(e.relatedTarget as Node)
      ) {
        setIsDropdownOpen1(false);
      }
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target as Node)) {
        setIsDropdownOpen1(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredRates = taxRates.filter((rate) =>
    rate.description.toLowerCase().includes(searchTerm1.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6 dark:text-white">
          Create New Expense Item
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Item Name */}
          <div>
            <label className="block text-sm mb-1 dark:text-gray-200">
              {item.itemType === 'Product' ? ' Item Name' : 'Service Name'}
            </label>
            <input
              type="text"
              value={item.itemName}
              onChange={(e) => handleChange('itemName', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Item Type */}
          <div>
            <label className="block text-sm mb-1 dark:text-gray-200">
              {item.itemType === 'Product' ? '  Item Type' : 'Service Type'}
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 dark:text-gray-200">
                <input
                  type="radio"
                  name="itemType"
                  value="Product"
                  checked={item.itemType === 'Product'}
                  onChange={() => handleChange('itemType', 'Product')}
                />
                <span>Product</span>
              </label>
              <label className="flex items-center space-x-2 dark:text-gray-200">
                <input
                  type="radio"
                  name="itemType"
                  value="Service"
                  checked={item.itemType === 'Service'}
                  onChange={() => handleChange('itemType', 'Service')}
                />
                <span>Service</span>
              </label>
            </div>
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-sm mb-1 dark:text-gray-200">
              Purchase Price
            </label>
            <div className="flex">
              <input
                type="number"
                value={item.purchasePrice}
                onChange={(e) => handleChange('purchasePrice', e.target.value)}
                className="w-full p-2 border-l border-t border-b rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <select
                value={item.purchasePriceType}
                onChange={(e) =>
                  handleChange('purchasePriceType', e.target.value)
                }
                className="p-2 border border-l-0 rounded-r dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option>Without Tax</option>
                <option>With Tax</option>
              </select>
            </div>
          </div>

          {/* Measuring Unit */}
          <div className="relative w-full mb-2.5" ref={dropdownRef}>
            <label className="block text-sm mb-1 dark:text-gray-200">
              Measuring Unit
            </label>
            {/* Custom Dropdown */}
            <div
              className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary cursor-pointer"
              onClick={() => setIsDropdownOpen(true)}
            >
              {selectedUnit ? selectedUnit.name : 'Select a unit'}
            </div>
            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div
                className="absolute w-full mt-2 bg-white dark:bg-form-input border border-gray-300 dark:border-form-strokedark rounded shadow-lg z-10"
                tabIndex={0}
                onBlur={handleBlur}
              >
                {/* Input Field Inside Dropdown */}
                <input
                  type="text"
                  className="w-full px-4 py-2 border-b border-gray-300 dark:border-form-strokedark outline-none"
                  placeholder="Type a unit..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  autoFocus
                />

                {/* Show loading or error */}
                {loading && (
                  <p className="px-4 py-2 text-gray-500">Loading...</p>
                )}
                {error && <p className="px-4 py-2 text-red-500">{error}</p>}

                {/* Options List */}
                <ul className="max-h-40 overflow-auto">
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((unit) => (
                      <li
                        key={unit.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleSelect(unit)}
                        tabIndex={0}
                      >
                        {unit.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No units found</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* HSN */}
          {/* HSN or SAC field based on Item Type */}
          <div>
            <label className="block text-sm mb-1 dark:text-gray-200">
              {item.itemType === 'Product' ? 'HSN' : 'SAC'}
            </label>
            <input
              type="text"
              value={item.hsnCode}
              onChange={(e) => handleChange('hsnCode', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* GST Tax Rate */}
          <div className="relative w-full mb-2.5" ref={dropdownRef1}>
            <label className="block text-sm mb-1 dark:text-gray-200">
              GST Tax rate %
            </label>
            {/* Dropdown Trigger */}
            <div
              className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary cursor-pointer"
              onClick={() => setIsDropdownOpen1(true)}
            >
              {selectedRate ? selectedRate.description : 'Select a tax rate'}
            </div>
            {/* Dropdown Content */}
            {isDropdownOpen1 && (
              <div
                className="absolute w-full mt-2 bg-white dark:bg-form-input border border-gray-300 dark:border-form-strokedark rounded shadow-lg z-10"
                tabIndex={0}
                onBlur={handleBlur1}
              >
                {/* Input Field */}
                <input
                  type="text"
                  className="w-full px-4 py-2 border-b border-gray-300 dark:border-form-strokedark outline-none"
                  placeholder="Type a tax rate..."
                  value={searchTerm1}
                  onChange={handleInputChange1}
                  autoFocus
                />

                {/* Loading or Error Message */}
                {loading1 && (
                  <p className="px-4 py-2 text-gray-500">Loading...</p>
                )}
                {error1 && <p className="px-4 py-2 text-red-500">{error1}</p>}

                {/* Tax Rate Options */}
                <ul className="max-h-40 overflow-auto">
                  {filteredRates.length > 0 ? (
                    filteredRates.map((rate) => (
                      <li
                        key={rate.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleSelect1(rate)}
                        tabIndex={0}
                      >
                        {rate.description}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No tax rates found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* ITC Applicable */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 dark:text-gray-200">
              ITC Applicable
            </label>
            <select
              value={item.ITC}
              onChange={(e) => handleChange('ITC', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Eligible</option>
              <option>Ineligible</option>
              <option>Ineligible Others</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="reset"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
              onClick={() => navigate(-1)}
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpenseItem;
