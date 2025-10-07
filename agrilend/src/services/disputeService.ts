
import apiClient from './api';

// Définition du type pour un litige. Adaptez-le si nécessaire pour correspondre à votre API.
export interface Dispute {
  id: number;
  title: string;
  description: string;
  farmer: string;
  buyer: string;
  orderId: number;
  amount: number;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  category: 'non-delivery' | 'quality' | 'cancellation' | 'other';
  hederaTxId: string;
}

// Récupérer tous les litiges
export const getDisputes = async (): Promise<Dispute[]> => {
  try {
    const response = await apiClient.get('/disputes'); // Adaptez l'endpoint '/disputes' si nécessaire
    return response.data;
  } catch (error) {
    console.error("Error fetching disputes:", error);
    throw error;
  }
};

// Mettre à jour un litige (exemple)
export const updateDispute = async (disputeId: number, data: Partial<Dispute>): Promise<Dispute> => {
  try {
    const response = await apiClient.put(`/disputes/${disputeId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating dispute ${disputeId}:`, error);
    throw error;
  }
};
