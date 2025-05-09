import { useState } from 'react';
import { Plus, X } from 'lucide-react'; // Import icons

// Props type define करें
interface LowStockWarningProps {
  value: number | "";
  onChange: (value: number | "") => void;
}

const LowStockWarning: React.FC<LowStockWarningProps> = ({ value, onChange }) => {
  const [showLowStockField, setShowLowStockField] = useState<boolean>(!!value);

  return (
    <div className="mb-4.5 w-full">
      {/* Heading with "+" button */}
      <div className="flex items-center justify-between">
        <label className="text-black dark:text-white font-semibold">
          Enable Low Stock Quantity Warning
        </label>
        <button
          type="button"
          onClick={() => setShowLowStockField(true)}
          className="p-1 rounded bg-primary text-white hover:bg-primary-dark transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Low Stock Quantity Form (Visible when toggled) */}
      {showLowStockField && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <label className="text-black dark:text-white font-medium">
              Low Stock Quantity
            </label>
            <button
              onClick={() => {
                setShowLowStockField(false);
                onChange(""); // Reset value in parent
              }}
              className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              <X size={20} />
            </button>
          </div>
          <input
            type="number"
            placeholder="Enter low stock quantity"
            value={value}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            className="w-full mt-2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      )}
    </div>
  );
};

export default LowStockWarning;
