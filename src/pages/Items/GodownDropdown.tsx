import { useState, useEffect } from "react";
import axios from "axios";

// Props की TypeScript टाइपिंग
interface GodownDropdownProps {
  value: string;
  onChange: (value: string) => void;
}


interface Godown {
  id: string | number;
  godownName: string;
  
}

const GodownDropdown: React.FC<GodownDropdownProps> = ({ value, onChange }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [godowns, setGodowns] = useState<Godown[]>([]);
  //const [selectedGodown, setSelectedGodown] = useState("");

  useEffect(() => {
    const fetchGodowns = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Token not found");
        const response = await axios.get<{ results: Godown[] }>(`${API_URL}/godown/godown/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", response.data);
  
        // Extract array from response object
        const data = response.data?.results || []; 
  
        if (Array.isArray(data)) {
          setGodowns(data);
        } else {
          console.error("Invalid API response format:", response.data);
          setGodowns([]);
        }
      } catch (error) {
        console.error("Error fetching Godown data:", error);
        setGodowns([]);
      }
    };
  
    fetchGodowns();
  }, [API_URL]);
  

  return (
    <div className="mb-4.5 w-full xl:w-1/2">
      <label className="mb-2.5 block text-black dark:text-white">
        Select Godown
      </label>
      <select
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Godown</option>
        {Array.isArray(godowns) &&
          godowns.map((godown) => (
            <option key={godown.id} value={String(godown.id)}>
              {godown.godownName}
            </option>
          ))}
      </select>
    </div>
  );
};

export default GodownDropdown;