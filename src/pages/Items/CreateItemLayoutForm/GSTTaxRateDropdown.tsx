import React, { useState, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface TaxRate {
  id: string;
  description: string;
}

interface GSTTaxRateDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const GSTTaxRateDropdown: React.FC<GSTTaxRateDropdownProps> = ({ value, onChange }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;

  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<TaxRate | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch GST tax rates from backend API using axios
  useEffect(() => {
    const fetchTaxRates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        let allRates: TaxRate[] = [];
        let nextPage: string | null = `${API_URL}/inventory/gst-tax-rates/`;

        while (nextPage) {
          const response: { data: { results: TaxRate[]; next: string | null } } = await axios.get(nextPage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          allRates = [...allRates, ...response.data.results];
          nextPage = response.data.next;
        }

        setTaxRates(allRates);

        // Set selectedRate if value prop matches any id
        const found = allRates.find(rate => rate.id === value);
        setSelectedRate(found || null);

      } catch (err) {
        let message = 'Unknown error';
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.detail || err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxRates();
  }, [API_URL, value]);

  // Handle user input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle tax rate selection
  const handleSelect = (rate: TaxRate) => {
    setSelectedRate(rate);
    onChange(rate.id);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
        setIsDropdownOpen(false);
      }
    }, 200);
  };

  // Filter tax rates based on search term
  const filteredRates = taxRates.filter((rate) =>
    rate.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full mb-2.5" ref={dropdownRef}>
      <label className="mb-2.5 block text-black dark:text-white">GST Tax Rate (%)</label>

      {/* Dropdown Trigger */}
      <div
        className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary cursor-pointer"
        onClick={() => setIsDropdownOpen(true)}
      >
        {selectedRate ? selectedRate.description : 'Select a tax rate'}
      </div>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div
          className="absolute w-full mt-2 bg-white dark:bg-form-input border border-gray-300 dark:border-form-strokedark rounded shadow-lg z-10"
          tabIndex={0}
          onBlur={handleBlur}
        >
          {/* Input Field */}
          <input
            type="text"
            className="w-full px-4 py-2 border-b border-gray-300 dark:border-form-strokedark outline-none"
            placeholder="Type a tax rate..."
            value={searchTerm}
            onChange={handleInputChange}
            autoFocus
          />

          {/* Loading or Error Message */}
          {loading && <p className="px-4 py-2 text-gray-500">Loading...</p>}
          {error && <p className="px-4 py-2 text-red-500">{error}</p>}

          {/* Tax Rate Options */}
          <ul className="max-h-40 overflow-auto">
            {filteredRates.length > 0 ? (
              filteredRates.map((rate) => (
                <li
                  key={rate.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleSelect(rate)}
                  tabIndex={0}
                >
                  {rate.description}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No tax rates found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GSTTaxRateDropdown;
