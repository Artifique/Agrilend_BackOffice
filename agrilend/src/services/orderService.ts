import apiClient from "./api";

// Définition du type pour une commande. Adaptez-le à la réponse de votre API.
export interface Order {
  id: string; // ou number
  // ... autres champs
}

// --- FONCTIONS POUR ADMINISTRATEURS ---

/**
 * Récupère toutes les commandes (paginé).
 */
export const getAllOrders = async (page = 0, size = 10): Promise<Order[]> => {
  try {
    const response = await apiClient.get("/admin/orders", {
      params: { page, size },
    });
    return response.data;
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
    const response = await apiClient.get(`/admin/orders/${orderId}`);
    return response.data;
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
    const response = await apiClient.post(`/admin/orders/${orderId}/status`, {
      status,
    });
    return response.data;
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
    await apiClient.post(`/admin/orders/${orderId}/release-escrow`);
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
    const response = await apiClient.post("/buyer/orders", orderData);
    return response.data;
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
    const response = await apiClient.get("/buyer/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    throw error;
  }
};
