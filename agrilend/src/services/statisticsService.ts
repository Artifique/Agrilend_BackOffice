import apiClient from "./api";

// --- TYPES DE DONNÉES POUR LES STATISTIQUES ---

export interface DashboardKpis {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  hederaTransactions: number;
  sequesteredAmount: number;
  platformRevenue: number;
  growthRates: {
    users: number;
    orders: number;
    transactions: number;
    revenue: number;
  };
}

export interface OrdersOverTime {
  mois: string;
  commandes: number;
  livrees: number;
  sequestres: number;
  revenus: number;
}

export interface ProductsDistribution {
  name: string;
  value: number;
  color: string;
  amount: number;
}

export interface BlockchainPerformance {
  jour: string;
  transactions: number;
  sequestres: number;
  staking: number;
  latence: number;
}

export interface Alert {
  id: number;
  type: 'warning' | 'info' | 'success' | 'critical';
  message: string;
  time: string;
}

// --- FONCTIONS DU SERVICE ---

/**
 * Récupère les KPIs du tableau de bord.
 */
export const getDashboardKpis = async (): Promise<DashboardKpis> => {
  try {
    const response = await apiClient.get("/admin/dashboard");
    const backendData = response.data.data; // Extraire l'objet 'data' de la réponse

    // Mapper les données du backend au type du frontend
    const frontendData: DashboardKpis = {
      totalUsers: backendData.totalUsers || 0,
      activeUsers: backendData.totalActiveUsers || 0,
      totalOrders: backendData.totalOrders || 0,
      completedOrders: backendData.totalDeliveredOrders || 0,
      pendingOrders: backendData.totalPendingOffers || 0,
      hederaTransactions: backendData.totalCompletedTransactions || 0,
      sequesteredAmount: backendData.totalEscrowedTransactions || 0,
      platformRevenue: backendData.totalRevenueLast30Days || 0,
      growthRates: { users: 10, orders: 5, transactions: 15, revenue: 8 }, // Données de test
    };
    return frontendData;
  } catch (error) {
    console.error("Error fetching dashboard kpis:", error);
    throw error;
  }
};

/**
 * Récupère les données pour le graphique des commandes.
 */
export const getOrdersOverTime = async (): Promise<OrdersOverTime[]> => {
  console.log("Fetching orders over time data...");
  // Données de test pour l'instant
  return [
    { mois: 'Jan', commandes: 120, livrees: 110, sequestres: 10, revenus: 12000 },
    { mois: 'Fev', commandes: 150, livrees: 140, sequestres: 10, revenus: 15000 },
    { mois: 'Mar', commandes: 180, livrees: 170, sequestres: 10, revenus: 18000 },
    { mois: 'Avr', commandes: 160, livrees: 150, sequestres: 10, revenus: 16000 },
    { mois: 'Mai', commandes: 200, livrees: 190, sequestres: 10, revenus: 20000 },
    { mois: 'Juin', commandes: 220, livrees: 210, sequestres: 10, revenus: 22000 },
  ];
};

const CHART_COLORS = ['#4CAF50', '#1E90FF', '#FFC107', '#FF5722', '#9C27B0', '#E91E63', '#00BCD4'];

/**
 * Récupère les données pour le graphique de répartition des produits.
 */
export const getProductsDistribution = async (): Promise<ProductsDistribution[]> => {
  try {
    const response = await apiClient.get<Record<string, number>>("/admin/dashboard/revenue/category");
    const revenueByCategory = response.data;

    const totalRevenue = Object.values(revenueByCategory).reduce((sum, revenue) => sum + revenue, 0);

    const productsDistribution = Object.entries(revenueByCategory).map(([category, revenue], index) => ({
      name: category,
      amount: revenue,
      value: totalRevenue > 0 ? parseFloat(((revenue / totalRevenue) * 100).toFixed(2)) : 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return productsDistribution;
  } catch (error) {
    console.error("Error fetching products distribution data:", error);
    throw error;
  }
};

/**
 * Récupère les données pour le graphique de performance de la blockchain.
 */
export const getBlockchainPerformance = async (): Promise<BlockchainPerformance[]> => {
  console.log("Fetching blockchain performance data...");
  // Données de test pour l'instant
  return [
    { jour: 'Lun', transactions: 100, sequestres: 50, staking: 20, latence: 1.2 },
    { jour: 'Mar', transactions: 120, sequestres: 60, staking: 25, latence: 1.1 },
    { jour: 'Mer', transactions: 110, sequestres: 55, staking: 22, latence: 1.3 },
    { jour: 'Jeu', transactions: 130, sequestres: 65, staking: 28, latence: 1.0 },
    { jour: 'Ven', transactions: 150, sequestres: 75, staking: 30, latence: 1.2 },
    { jour: 'Sam', transactions: 140, sequestres: 70, staking: 29, latence: 1.4 },
    { jour: 'Dim', transactions: 160, sequestres: 80, staking: 35, latence: 1.1 },
  ];
};

/**
 * Récupère les alertes.
 */
export const getAlerts = async (): Promise<Alert[]> => {
  console.log("Fetching alerts...");
  // Données de test pour l'instant
  return [
    { id: 1, type: 'warning', message: 'Le noeud Hedera #3 est lent.', time: '2 minutes' },
    { id: 2, type: 'info', message: 'Mise à jour du système prévue à 2h du matin.', time: '1 heure' },
    { id: 3, type: 'critical', message: 'Echec de la transaction #12345.', time: '5 minutes' },
    { id: 4, type: 'success', message: 'La sauvegarde du système est terminée.', time: '10 minutes' },
  ];
};