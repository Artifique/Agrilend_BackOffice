
import apiClient from './api';

// Définition du type pour une transaction financière. Adaptez-le si nécessaire.
export interface FinancialTransaction {
  id: number;
  orderId: number;
  type: 'escrow' | 'release' | 'staking' | 'fee' | 'refund';
  amount: number;
  currency: 'HBAR' | 'USD';
  status: 'completed' | 'pending' | 'failed';
  hederaTxId: string;
  timestamp: string;
  fees: number;
  stakingReward?: number;
}

// Récupérer toutes les transactions financières
export const getFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
  try {
    const response = await apiClient.get('/transactions'); // Adaptez l'endpoint '/transactions'
    return response.data;
  } catch (error) {
    console.error("Error fetching financial transactions:", error);
    throw error;
  }
};
