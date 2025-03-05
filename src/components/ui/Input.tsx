import React, { ChangeEvent, InputHTMLAttributes } from "react";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  touchedName?: boolean;
  errorsName?: string;
  datalistValues?: string[];
}

export default function Input({
  children,
  touchedName,
  errorsName,
  datalistValues,
  onChange,
  ...props
}: InputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium leading-6 text-black">
        {children}
      </label>

      {datalistValues ? (
        <select
          {...props}
          className="w-full rounded-md border-5 bg-transparent/5 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
          onChange={handleInputChange}
          value={props.value}
        >
          <option value="" disabled>Select {children}</option>
          {datalistValues.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="mt-2">
          <input
            {...props}
            className={`w-full rounded-md border-5 bg-transparent/5 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
              touchedName && errorsName ? "border-red-600" : ""
            }`}
            onChange={handleInputChange}
          />
          {touchedName && errorsName && <p className="text-red-600 mt-2 text-sm">{errorsName}</p>}
        </div>
      )}
    </div>
  );
}