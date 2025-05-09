import React, { useState, useRef, useEffect, ChangeEvent, FocusEvent } from 'react';
import axios from 'axios';

interface MeasuringUnit {
  id: number;
  name: string;
  
}

interface MeasuringUnitDropdownProps {
  value: number | null;
  onChange: (id: number) => void;
}

const MeasuringUnitDropdown: React.FC<MeasuringUnitDropdownProps> = ({ value, onChange }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [measuringUnits, setMeasuringUnits] = useState<MeasuringUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<MeasuringUnit | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch measuring units from backend API using axios
  useEffect(() => {
    const fetchMeasuringUnits = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        let allUnits: MeasuringUnit[] = [];
        let nextPage: string | null = `${API_URL}/inventory/measuring-units/`;

        while (nextPage) {
          const response = await axios.get(nextPage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const data = response.data;
          allUnits = [...allUnits, ...data.results];

          nextPage = data.next;
        }

        setMeasuringUnits(allUnits);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch measuring units');
      } finally {
        setLoading(false);
      }
    };

    fetchMeasuringUnits();
  }, [API_URL]);

  // Handle user input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle unit selection
  const handleSelect = (unit: MeasuringUnit) => {
    setSelectedUnit(unit);
    onChange(unit.id);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
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

  // Filter measuring units based on searchTerm
  const filteredUnits = measuringUnits.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full mb-2.5" ref={dropdownRef}>
      <label className="mb-2.5 block text-black dark:text-white">
        Measuring Unit
      </label>

      {/* Custom Dropdown */}
      <div
        className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary cursor-pointer"
        onClick={() => setIsDropdownOpen(true)}
      >
        {selectedUnit ? selectedUnit.name : "Select a unit"}
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
          {loading && <p className="px-4 py-2 text-gray-500">Loading...</p>}
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
  );
};

export default MeasuringUnitDropdown;
