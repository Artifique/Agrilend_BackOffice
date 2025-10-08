import apiClient from "./api";
import { Order } from "../types"; // Importer depuis les types globaux

// Structure de réponse générique de l'API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Structure pour les réponses paginées
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// --- FONCTIONS POUR ADMINISTRATEURS ---

/**
 * Récupère toutes les commandes (paginé).
 */
export const getAllOrders = async (page = 0, size = 10): Promise<Order[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>("/admin/orders", {
      params: { page, size },
    });
    return response.data.data.content; // Extraire le contenu de la réponse paginée
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

/**
 * Récupère une commande par son ID.
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<ApiResponse<Order>>(`/admin/orders/${orderId}`);
    return response.data.data; // Extraire les données de la commande
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une commande.
 */
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Libère les fonds en séquestre pour une commande.
 */
export const releaseEscrow = async (orderId: string): Promise<void> => {
  try {
    // La réponse peut ne pas avoir de contenu, donc pas de .data.data
    await apiClient.post<ApiResponse<void>>(`/admin/orders/${orderId}/release-escrow`);
  } catch (error) {
    console.error(`Error releasing escrow for order ${orderId}:`, error);
    throw error;
  }
};

// --- FONCTIONS POUR ACHETEURS ---

/**
 * Passe une nouvelle commande.
 */
export const createOrder = async (
  orderData: Record<string, unknown>
): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>("/buyer/orders", orderData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Récupère les commandes de l'acheteur connecté.
 */
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>("/buyer/orders");
    return response.data.data.content;
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    throw error;
  }
};