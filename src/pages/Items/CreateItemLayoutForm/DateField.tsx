import React from "react";

interface DateFieldProps {
  value: string;
  onChange: (date: string) => void;
}

const DateField: React.FC<DateFieldProps> = ({ value, onChange }) => {
  // Initialize with current date
  {/*const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });*/}

  return (
    <div className="mb-4.5 xl:w-1/2">
      <label className="mb-2.5 block text-black dark:text-white">
        Select Date
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  );
};

export default DateField;