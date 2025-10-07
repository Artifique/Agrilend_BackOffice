import apiClient from "./api";

// Assuming a generic API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// For 11.1. Obtenir les statistiques du dashboard
export interface DashboardStats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOffers: number;
  pendingOffers: number;
  totalOrders: number;
  ordersInEscrow: number;
  totalRevenue: number;
  totalTokensMinted: number;
}

// For 11.3. Revenu mensuel (Map<String, BigDecimal>)
export interface MonthlyRevenue {
  [monthYear: string]: number; // e.g., "October 2025": 25000.75
}

// For 11.4. Revenu annuel (Map<String, BigDecimal>)
export interface AnnualRevenue {
  [year: string]: number; // e.g., "2025": 150000.00
}

// For 11.5. Revenu par catégorie (Map<String, BigDecimal>)
export interface CategoryRevenue {
  [category: string]: number; // e.g., "Fruits": 75000.00
}

const BASE_URL = "/admin"; // Base URL for admin endpoints

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>(`${BASE_URL}/dashboard`);
  return response.data.data;
};

export const getMonthlyRevenue = async (year: number, month: number): Promise<MonthlyRevenue> => {
  const response = await apiClient.get<ApiResponse<MonthlyRevenue>>(`${BASE_URL}/dashboard/monthly-revenue`, {
    params: { year, month },
  });
  return response.data.data;
};

export const getAnnualRevenue = async (year: number): Promise<AnnualRevenue> => {
  const response = await apiClient.get<ApiResponse<AnnualRevenue>>(`${BASE_URL}/dashboard/annual-revenue`, {
    params: { year },
  });
  return response.data.data;
};

export const getCategoryRevenue = async (): Promise<CategoryRevenue> => {
  const response = await apiClient.get<ApiResponse<CategoryRevenue>>(`${BASE_URL}/dashboard/category-revenue`);
  return response.data.data;
};
