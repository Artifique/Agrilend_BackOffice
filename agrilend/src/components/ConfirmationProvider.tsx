import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';

// Types pour les confirmations
export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationContextType {
  showConfirmation: (dialog: Omit<ConfirmationDialog, 'id'>) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export { ConfirmationContext };

// Provider des confirmations
export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogs, setDialogs] = useState<ConfirmationDialog[]>([]);

  const showConfirmation = useCallback((dialog: Omit<ConfirmationDialog, 'id'>) => {
    const id = Date.now().toString();
    const newDialog: ConfirmationDialog = {
      ...dialog,
      id,
      confirmText: dialog.confirmText || 'Confirmer',
      cancelText: dialog.cancelText || 'Annuler'
    };

    setDialogs(prev => [...prev, newDialog]);
  }, []);

  const handleConfirm = useCallback((dialog: ConfirmationDialog) => {
    dialog.onConfirm();
    setDialogs(prev => prev.filter(d => d.id !== dialog.id));
  }, []);

  const handleCancel = useCallback((dialog: ConfirmationDialog) => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    setDialogs(prev => prev.filter(d => d.id !== dialog.id));
  }, []);

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmationContainer 
        dialogs={dialogs} 
        onConfirm={handleConfirm} 
        onCancel={handleCancel} 
      />
    </ConfirmationContext.Provider>
  );
};

// Composant pour afficher les confirmations
interface ConfirmationContainerProps {
  dialogs: ConfirmationDialog[];
  onConfirm: (dialog: ConfirmationDialog) => void;
  onCancel: (dialog: ConfirmationDialog) => void;
}

const ConfirmationContainer: React.FC<ConfirmationContainerProps> = ({ 
  dialogs, 
  onConfirm, 
  onCancel 
}) => {
  const getIcon = (type: ConfirmationDialog['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'danger':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonColor = (type: ConfirmationDialog['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  if (dialogs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {dialogs.map((dialog) => (
          <div
            key={dialog.id}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(dialog.type)}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {dialog.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {dialog.message}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onCancel(dialog)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {dialog.cancelText}
                  </button>
                  <button
                    onClick={() => onConfirm(dialog)}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${getButtonColor(dialog.type)}`}
                  >
                    {dialog.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
