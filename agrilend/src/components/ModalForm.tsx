import React from 'react';
import { Loader2 } from 'lucide-react';

interface ModalFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  submitVariant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  onSubmit,
  onCancel,
  submitText = 'Confirmer',
  cancelText = 'Annuler',
  isLoading = false,
  children,
  submitVariant = 'primary',
  className = ''
}) => {
  const getSubmitClasses = () => {
    switch (submitVariant) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      default:
        return 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] hover:from-[#1E90FF] hover:to-[#4CAF50]';
    }
  };

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {/* Form Fields */}
      <div className="space-y-4">
        {children}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getSubmitClasses()}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Chargement...</span>
            </div>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default ModalForm;
