import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Props interface for the component
interface HSNCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

// Suggestion type
interface HSNSuggestion {
  code: string;
  description: string;
}

const HSNCodeField: React.FC<HSNCodeFieldProps> = ({ value, onChange }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<HSNSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetchHSNCodes();
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchHSNCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/hsn-api/hsn/${searchQuery}`);
      // console.log(response);

      if (response.data) {
        // Check if the response contains hsn_cd and hsn_description
        const { hsn_cd, hsn_description } = response.data;
        if (hsn_cd && hsn_description) {
          setSuggestions([{ code: hsn_cd, description: hsn_description }]);
        } else {
          setSuggestions([]); // Clear suggestions if no valid data
        }
      } else {
        setSuggestions([]); // Clear suggestions if no data returned
      }
    } catch (error) {
      console.error('Error fetching HSN codes:', error);
      setSuggestions([]); // Handle error gracefully by clearing suggestions
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHSN = (code: string, description: string) => {
    onChange(code);
    setIsModalOpen(false);
    // Optionally, store or display the description if needed
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex !== -1) {
      handleSelectHSN(suggestions[activeIndex].code, suggestions[activeIndex].description);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="mb-4.5 xl:w-1/3 relative">
      <label className="mb-2.5 block text-black dark:text-white">
        HSN Code
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter HSN Code"
        readOnly
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="mt-2 text-blue-500 hover:underline"
      >
        Find HSN Code
      </button>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3"
          >
            <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
              Search HSN Code
            </h2>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter HSN Code"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 mb-3 text-black outline-none focus:border-primary"
            />

            {/* Loading Indicator */}
            {loading && <p className="text-blue-500">Fetching...</p>}

            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto dark:border-gray-700">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectHSN(item.code, item.description)}
                    className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      activeIndex === index ? 'bg-gray-300 dark:bg-gray-600' : ''
                    }`}
                  >
                    <span className="font-medium text-black dark:text-white">
                      {item.code}
                    </span>{' '}
                    -{' '}
                    <span className="text-gray-500 dark:text-gray-300">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HSNCodeField;