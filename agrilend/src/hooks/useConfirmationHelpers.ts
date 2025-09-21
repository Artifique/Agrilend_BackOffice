import { useContext, useCallback } from 'react';
import { ConfirmationContext } from '../components/ConfirmationProvider';

export const useConfirmationHelpers = () => {
  const { showConfirmation } = useContext(ConfirmationContext)!;

  const confirmDelete = useCallback((itemName: string, onConfirm: () => void) => {
    showConfirmation({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`,
      type: 'danger',
      confirmText: 'Supprimer',
      onConfirm
    });
  }, [showConfirmation]);

  const confirmReset = useCallback((onConfirm: () => void) => {
    showConfirmation({
      title: 'Confirmer la réinitialisation',
      message: 'Êtes-vous sûr de vouloir réinitialiser toutes les configurations ? Cette action est irréversible.',
      type: 'warning',
      confirmText: 'Réinitialiser',
      onConfirm
    });
  }, [showConfirmation]);

  const confirmAction = useCallback((title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'info') => {
    showConfirmation({
      title,
      message,
      type,
      onConfirm
    });
  }, [showConfirmation]);

  return {
    confirmDelete,
    confirmReset,
    confirmAction
  };
};
