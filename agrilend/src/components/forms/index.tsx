// Composants de formulaires pour AGRILEND
import React from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { FormFieldProps } from '../../types';

// Composant de champ de formulaire amélioré
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
  rows = 3,
  options = [],
  error,
  disabled = false,
  className = ''
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e);
  };
  
  const renderInput = () => {
    const baseClasses = `block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
      error ? 'border-red-500' : 'border-gray-300'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;
    
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled}
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
        
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={baseClasses}
          />
        );
        
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name={name}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`${baseClasses} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        );
        
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={baseClasses}
          />
        );
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Composant de formulaire avec validation
interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  onCancel,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  isLoading = false,
  children,
  className = ''
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
      
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {submitText}
        </button>
      </div>
    </form>
  );
};

// Composant de champ de recherche avancée
interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onSearch,
  onClear,
  loading = false,
  className = ''
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
        )}
        
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-gray-600 mr-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            className="px-3 py-1 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm"
          >
            Rechercher
          </button>
        )}
      </div>
    </div>
  );
};

// Composant de sélecteur de date
interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        required={required}
        className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Composant de sélecteur de fichier
interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  onChange,
  error,
  className = ''
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onChange(e.dataTransfer.files);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive ? 'border-[#4CAF50] bg-green-50' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-[#4CAF50] hover:text-[#45a049] cursor-pointer">
              Cliquez pour télécharger
            </span>
            {' '}ou glissez-déposez
          </div>
          
          <p className="text-xs text-gray-500">
            {accept && `Types acceptés: ${accept}`}
            {multiple && ' (plusieurs fichiers autorisés)'}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Composant de switch/toggle
interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 ${
          checked ? 'bg-[#4CAF50]' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Composant de validation en temps réel
interface ValidationIndicatorProps {
  isValid: boolean;
  message?: string;
  className?: string;
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  isValid,
  message,
  className = ''
}) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center text-sm ${className}`}>
      {isValid ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600">{message}</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-red-600">{message}</span>
        </>
      )}
    </div>
  );
};
