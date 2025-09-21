// Composants réutilisables pour les formulaires de gestion
import React from 'react';
import { Modal, ModalForm, FormField } from '..';
import { useForm } from '../../hooks';

// Interface pour les props de base des formulaires
interface BaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  title: string;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
}

// Composant de formulaire générique pour les entités
export const EntityForm: React.FC<BaseFormProps & {
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    min?: string | number;
    max?: string | number;
    step?: string | number;
    rows?: number;
  }>;
  initialValues: Record<string, unknown>;
  validationRules?: Record<string, (value: unknown) => string | null>;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  isLoading = false,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  fields,
  initialValues
}) => {
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    resetForm
  } = useForm(initialValues);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(values);
      resetForm();
    }
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      type="success"
      size="lg"
    >
      <ModalForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitText={submitText}
        cancelText={cancelText}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={values[field.name] as string}
              onChange={(e) => handleChange(field.name as keyof typeof values, e.target.value)}
              onBlur={() => handleBlur(field.name as keyof typeof values)}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
              rows={field.rows}
              options={field.options}
              error={touched[field.name] ? errors[field.name] : undefined}
            />
          ))}
        </div>
      </ModalForm>
    </Modal>
  );
};

// Composant de modal de confirmation
export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger',
  isLoading = false
}) => {
  const typeClasses = {
    danger: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type === 'danger' ? 'error' : type === 'warning' ? 'warning' : 'info'}
      size="md"
    >
      <div className="space-y-4">
        <p className={`text-sm ${typeClasses[type]}`}>
          {message}
        </p>
        
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${
              type === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                : type === 'warning'
                ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Chargement...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant de modal de visualisation
export const ViewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
  fields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'currency' | 'number' | 'status';
    format?: (value: unknown) => string;
  }>;
}> = ({
  isOpen,
  onClose,
  title,
  data,
  fields
}) => {
  const formatValue = (value: unknown, type?: string, format?: (value: unknown) => string) => {
    if (format) return format(value);
    
    switch (type) {
      case 'date':
        return new Date(value as string).toLocaleDateString('fr-FR');
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(value as number);
      case 'number':
        return new Intl.NumberFormat('fr-FR').format(value as number);
      case 'status':
        return String(value);
      default:
        return String(value);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="info"
      size="lg"
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">{field.label}:</span>
            <span className="text-gray-900">
              {formatValue(data[field.key], field.type, field.format)}
            </span>
          </div>
        ))}
        
        <div className="flex items-center justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant de barre d'actions
export const ActionBar: React.FC<{
  onAdd?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  addText?: string;
  showSearch?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  isLoading?: boolean;
}> = ({
  onAdd,
  onRefresh,
  onExport,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  addText = 'Ajouter',
  showSearch = true,
  showRefresh = true,
  showExport = true,
  isLoading = false
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {addText}
          </button>
        )}
        
        {showRefresh && onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        
        {showExport && onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center px-3 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter
          </button>
        )}
      </div>
      
      {showSearch && onSearchChange && (
        <div className="flex-1 max-w-md ml-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
};
