import { useState } from "react";


interface DataListProps {
  values: string[];
  onChange?: (selectedValue: string) => void;
}

export default function DataList({ values, onChange }: DataListProps) {
  const [selectedValue, setSelectedValue] = useState<string>(values[0] || "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <select
      name="priority"
      id="priority"
      className="w-full rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
      value={selectedValue}
      onChange={handleChange}
    >
      {values.map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
}
