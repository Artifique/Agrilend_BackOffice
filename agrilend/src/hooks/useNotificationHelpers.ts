import { useContext, useCallback } from 'react';
import { NotificationContext } from '../components/NotificationProvider';

export const useNotificationHelpers = () => {
  const { addNotification } = useContext(NotificationContext)!;

  const showSuccess = useCallback((title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string) => {
    addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
