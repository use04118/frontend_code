import { useState, useEffect, useRef } from 'react';
import axios from 'axios';


interface State {
  id: number;
  name: string;
}


interface StateDropdownProps {
  onSelectState: (stateId: number) => void;
}

const StateDropdown: React.FC<StateDropdownProps> = ({ onSelectState }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [states, setStates] = useState<State[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      // Axios का इस्तेमाल
      const response = await axios.get<{ results: State[] }>(`${API_URL}/godown/state/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.results && Array.isArray(response.data.results)) {
        setStates(response.data.results);
        setFilteredStates(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = states.filter((state) =>
        state.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates(states);
    }
    setShowDropdown(true);
  };

  const handleSelectState = (state: State) => {
    setSearchQuery(state.name);
    setShowDropdown(false);
    onSelectState(state.id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4.5" ref={dropdownRef}>
      <label className="mb-2.5 block text-black dark:text-white">State</label>

      {/* Input Field */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="Enter State"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />

      {/* Dropdown Arrow Icon */}
      <div className="absolute right-3 mt-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-500 dark:text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown List */}
      {showDropdown && (
        <ul className="absolute left-0 w-full mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
          <li
            onClick={() => handleSelectState({ id: 0, name: 'Select State' })}
            className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-semibold"
          >
            Select State
          </li>
          {filteredStates.map((state) => (
            <li
              key={state.id}
              onClick={() => handleSelectState(state)}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white"
            >
              {state.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StateDropdown;