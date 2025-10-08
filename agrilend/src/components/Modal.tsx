import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'full': return 'max-w-7xl';
      default: return 'max-w-lg';
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return {
          header: 'bg-gradient-to-r from-green-500 to-green-600',
          icon: <CheckCircle className="h-6 w-6 text-white" />,
          accent: 'border-green-500'
        };
      case 'warning':
        return {
          header: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: <AlertTriangle className="h-6 w-6 text-white" />,
          accent: 'border-yellow-500'
        };
      case 'error':
        return {
          header: 'bg-gradient-to-r from-red-500 to-red-600',
          icon: <AlertCircle className="h-6 w-6 text-white" />,
          accent: 'border-red-500'
        };
      case 'info':
        return {
          header: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: <Info className="h-6 w-6 text-white" />,
          accent: 'border-blue-500'
        };
      default:
        return {
          header: 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF]',
          icon: null,
          accent: 'border-[#4CAF50]'
        };
    }
  };

  const typeClasses = getTypeClasses();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Modal */}
      <div 
        className={`
          relative w-full ${getSizeClasses()} mx-auto
          bg-white rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${typeClasses.header} rounded-t-2xl px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {typeClasses.icon}
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;