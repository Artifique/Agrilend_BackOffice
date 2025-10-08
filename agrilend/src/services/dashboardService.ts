import apiClient from "./api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalInactiveUsers: number;
  totalPendingUsers: number;
  totalActiveFarmers: number;
  totalActiveBuyers: number;
  totalOffers: number;
  totalPendingOffers: number;
  totalApprovedOffers: number;
  totalRejectedOffers: number;
  totalOrders: number;
  totalPendingOrders: number;
  totalDeliveredOrders: number;
  totalTransactions: number;
  totalPendingTransactions: number;
  totalCompletedTransactions: number;
  totalEscrowedTransactions: number;
  totalDeliveries: number;
  totalScheduledDeliveries: number;
  totalDeliveredDeliveries: number;
  totalRevenueLast30Days: number;
}

export interface MonthlyRevenue {
  month: number;
  year: number;
  totalRevenue: number;
}

export interface CategoryRevenue {
  category: string;
  totalRevenue: number;
}

export interface DailyRevenue {
  date: string;
  totalRevenue: number;
}

export interface YearlyRevenue {
  year: number;
  totalRevenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const getMonthlyRevenue = async (year: number, month: number): Promise<MonthlyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>("/admin/dashboard/revenue/monthly", {
      params: { year, month },
    });
    const monthlyRevenueObject = response.data.data;
    const monthlyRevenueArray: MonthlyRevenue[] = Object.entries(monthlyRevenueObject).map(([key, value]) => {
      const [itemYear, itemMonth] = key.split("-").map(Number);
      return { month: itemMonth, year: itemYear, totalRevenue: value };
    });
    return monthlyRevenueArray;
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error;
  }
};

export const getCategoryRevenue = async (): Promise<CategoryRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>("/admin/dashboard/revenue/category");
    const categoryRevenueObject = response.data.data;
    const categoryRevenueArray: CategoryRevenue[] = Object.entries(categoryRevenueObject).map(([category, totalRevenue]) => ({
      category,
      totalRevenue,
    }));
    return categoryRevenueArray;
  } catch (error) {
    console.error("Error fetching category revenue:", error);
    throw error;
  }
};

export const getDailyRevenue = async (date: string): Promise<DailyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyRevenue[]>>("/admin/dashboard/revenue/daily", {
      params: { date },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    throw error;
  }
};

export const getYearlyRevenue = async (year: number): Promise<YearlyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<YearlyRevenue[]>>("/admin/dashboard/revenue/yearly", {
      params: { year },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching yearly revenue:", error);
    throw error;
  }
};

export const getRevenueLastYear = async (): Promise<YearlyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<YearlyRevenue[]>>("/admin/dashboard/revenue/lastyear");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching last year revenue:", error);
    throw error;
  }
};

export const getRevenueLast3Months = async (): Promise<MonthlyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>("/admin/dashboard/revenue/last3months");
    const monthlyRevenueObject = response.data.data;
    const monthlyRevenueArray: MonthlyRevenue[] = Object.entries(monthlyRevenueObject).map(([key, value]) => {
      const [itemYear, itemMonth] = key.split("-").map(Number);
      return { month: itemMonth, year: itemYear, totalRevenue: value };
    });
    return monthlyRevenueArray;
  } catch (error) {
    console.error("Error fetching last 3 months revenue:", error);
    throw error;
  }
};

export const getRevenueLast30Days = async (): Promise<DailyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyRevenue[]>>("/admin/dashboard/revenue/last30days");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching last 30 days revenue:", error);
    throw error;
  }
};

export const getRevenueLast7Days = async (): Promise<DailyRevenue[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyRevenue[]>>("/admin/dashboard/revenue/last7days");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching last 7 days revenue:", error);
    throw error;
  }
};
