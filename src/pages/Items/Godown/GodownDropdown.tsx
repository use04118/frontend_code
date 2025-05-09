import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';


interface Godown {
  id: number;
  godownName: string;
  
}

// Props ka type define karte hain
interface GodownDropdownProps {
  onSelectGodown: (id: number) => void;
  onEditGodown: (id: number) => void;
}

const GodownDropdown: React.FC<GodownDropdownProps> = ({ onSelectGodown, onEditGodown }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [selectedGodown, setSelectedGodown] = useState<Godown | null>(null);
  const [mainGodownId, setMainGodownId] = useState<number | null>(null); // Track main Godown
  const navigate = useNavigate();

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<{ results: Godown[] }>(`${API_URL}/godown/godown/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let data = response.data?.results || [];

      if (Array.isArray(data) && data.length > 0) {
        // Oldest Godown dhundhne ke liye sort karein
        const oldestGodown = data.reduce((oldest, current) => 
          oldest.id < current.id ? oldest : current
        );

        setGodowns(data);
        setMainGodownId(oldestGodown.id); // Store oldest Godown ID as Main Godown
        setSelectedGodown(oldestGodown);
        onSelectGodown(oldestGodown.id);
      } else {
        setGodowns([]);
      }
    } catch (error) {
      console.error('Error fetching Godown data:', error);
      setGodowns([]);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = godowns.find((godown) => godown.id.toString() === selectedId);
    setSelectedGodown(selected || null);
    onSelectGodown(Number(selectedId));
  };

  const handleEdit = () => {
    if (selectedGodown) {
      onEditGodown(selectedGodown.id);
      navigate(`/Items/Godown/edit/${selectedGodown.id}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedGodown) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this Godown?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      await axios.delete(`${API_URL}/godown/godown/${selectedGodown.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Godown deleted successfully!');
      fetchGodowns(); // Refresh the dropdown list
    } catch (error) {
      console.error('Error deleting Godown:', error);
      alert('Failed to delete Godown.');
    }
  };

  return (
    <div className="w-full">
      {/* Dropdown */}
      <div className="mb-4.5 w-1/5">
        <select
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
          onChange={handleSelectChange}
          value={selectedGodown ? selectedGodown.id : ''}
        >
          <option value="">Select Godown</option>
          {Array.isArray(godowns) &&
            godowns.map((godown) => (
              <option key={godown.id} value={godown.id}>
                {godown.godownName}
              </option>
            ))}
        </select>
      </div>

      {/* Display selected Godown */}
      {selectedGodown && (
        <div className="w-full min-h-[50px] bg-gray-200 dark:bg-gray-800 flex justify-between items-center p-5 rounded-md mt-2">
          <p className="text-xl font-bold text-black dark:text-white flex-1">
            {selectedGodown.godownName} {selectedGodown.id === mainGodownId && (
        <span className="text-sm text-blue-500 bg-blue-100 px-2 py-0.5 rounded">
          Main Godown
        </span>
      )}
          </p>
          <div className="ml-3 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GodownDropdown;
