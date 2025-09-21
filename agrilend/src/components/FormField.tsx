import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
  rows = 3,
  min,
  max,
  step,
  className = ''
}) => {
  const baseClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`${baseClasses} resize-none`}
          />
        );
      
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={baseClasses}
          >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
