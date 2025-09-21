// Services pour AGRILEND
import { 
  User, Order, Dispute, FinancialTransaction, Product, Delivery, 
  PricingConfig, GlobalSettings, AuditLog, DashboardMetrics,
  ApiResponse, PaginatedResponse 
} from '../types';

// Service de base pour les appels API
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('agrilend_auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('agrilend_auth_token', token);
    } else {
      localStorage.removeItem('agrilend_auth_token');
    }
  }
}

// Instance globale du service API
const apiService = new ApiService();

// Service d'authentification
export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiService.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    
    if (response.success) {
      apiService.setToken(response.data.token);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout', {});
    } finally {
      apiService.setToken(null);
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<User>('/auth/profile');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh', {});
    
    if (response.success) {
      apiService.setToken(response.data.token);
    }
    
    return response.data;
  }
}

// Service de gestion des utilisateurs
export class UserService {
  async getUsers(page: number = 1, limit: number = 10, role?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role }),
    });
    
    const response = await apiService.get<PaginatedResponse<User>>(`/users?${params}`);
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await apiService.post<User>('/users', userData);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiService.delete(`/users/${id}`);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiService.get<User[]>(`/users/role/${role}`);
    return response.data;
  }
}

// Service de gestion des commandes
export class OrderService {
  async getOrders(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    
    const response = await apiService.get<PaginatedResponse<Order>>(`/orders?${params}`);
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await apiService.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await apiService.post<Order>('/orders', orderData);
    return response.data;
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    const response = await apiService.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await apiService.delete(`/orders/${id}`);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const response = await apiService.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  }
}

// Service de gestion des produits
export class ProductService {
  async getProducts(page: number = 1, limit: number = 10, category?: string): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    
    const response = await apiService.get<PaginatedResponse<Product>>(`/products?${params}`);
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await apiService.get<Product>(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await apiService.post<Product>('/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiService.put<Product>(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/products/${id}`);
  }

  async validateProduct(id: number, status: 'approved' | 'rejected'): Promise<Product> {
    const response = await apiService.post<Product>(`/products/${id}/validate`, { status });
    return response.data;
  }
}

// Service de gestion des litiges
export class DisputeService {
  async getDisputes(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<Dispute>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    
    const response = await apiService.get<PaginatedResponse<Dispute>>(`/disputes?${params}`);
    return response.data;
  }

  async getDisputeById(id: number): Promise<Dispute> {
    const response = await apiService.get<Dispute>(`/disputes/${id}`);
    return response.data;
  }

  async createDispute(disputeData: Partial<Dispute>): Promise<Dispute> {
    const response = await apiService.post<Dispute>('/disputes', disputeData);
    return response.data;
  }

  async updateDispute(id: number, disputeData: Partial<Dispute>): Promise<Dispute> {
    const response = await apiService.put<Dispute>(`/disputes/${id}`, disputeData);
    return response.data;
  }

  async deleteDispute(id: number): Promise<void> {
    await apiService.delete(`/disputes/${id}`);
  }

  async assignDispute(id: number, assignedTo: string): Promise<Dispute> {
    const response = await apiService.post<Dispute>(`/disputes/${id}/assign`, { assignedTo });
    return response.data;
  }

  async resolveDispute(id: number, resolution: string): Promise<Dispute> {
    const response = await apiService.post<Dispute>(`/disputes/${id}/resolve`, { resolution });
    return response.data;
  }
}

// Service de gestion financière
export class FinancialService {
  async getTransactions(page: number = 1, limit: number = 10): Promise<PaginatedResponse<FinancialTransaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<PaginatedResponse<FinancialTransaction>>(`/financial/transactions?${params}`);
    return response.data;
  }

  async createEscrow(orderId: number, amount: number): Promise<FinancialTransaction> {
    const response = await apiService.post<FinancialTransaction>('/financial/escrow', {
      orderId,
      amount,
    });
    return response.data;
  }

  async releaseFunds(orderId: number): Promise<FinancialTransaction> {
    const response = await apiService.post<FinancialTransaction>('/financial/release', {
      orderId,
    });
    return response.data;
  }

  async activateStaking(amount: number): Promise<FinancialTransaction> {
    const response = await apiService.post<FinancialTransaction>('/financial/staking', {
      amount,
    });
    return response.data;
  }
}

// Service de gestion logistique
export class LogisticsService {
  async getDeliveries(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Delivery>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<PaginatedResponse<Delivery>>(`/logistics/deliveries?${params}`);
    return response.data;
  }

  async getDeliveryById(id: number): Promise<Delivery> {
    const response = await apiService.get<Delivery>(`/logistics/deliveries/${id}`);
    return response.data;
  }

  async createDelivery(deliveryData: Partial<Delivery>): Promise<Delivery> {
    const response = await apiService.post<Delivery>('/logistics/deliveries', deliveryData);
    return response.data;
  }

  async updateDelivery(id: number, deliveryData: Partial<Delivery>): Promise<Delivery> {
    const response = await apiService.put<Delivery>(`/logistics/deliveries/${id}`, deliveryData);
    return response.data;
  }

  async trackDelivery(id: number): Promise<{ status: string; location: string; timestamp: string }> {
    const response = await apiService.get<{ status: string; location: string; timestamp: string }>(`/logistics/deliveries/${id}/track`);
    return response.data;
  }
}

// Service de gestion des rapports
export class ReportService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiService.get<DashboardMetrics>('/reports/dashboard');
    return response.data;
  }

  async getSalesReport(startDate: string, endDate: string): Promise<Record<string, unknown>> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    
    const response = await apiService.get<Record<string, unknown>>(`/reports/sales?${params}`);
    return response.data;
  }

  async getUserReport(): Promise<Record<string, unknown>> {
    const response = await apiService.get<Record<string, unknown>>('/reports/users');
    return response.data;
  }

  async getFinancialReport(): Promise<Record<string, unknown>> {
    const response = await apiService.get<Record<string, unknown>>('/reports/financial');
    return response.data;
  }
}

// Service de gestion des paramètres
export class SettingsService {
  async getPricingConfigs(): Promise<PricingConfig[]> {
    const response = await apiService.get<PricingConfig[]>('/settings/pricing');
    return response.data;
  }

  async updatePricingConfig(id: string, config: Partial<PricingConfig>): Promise<PricingConfig> {
    const response = await apiService.put<PricingConfig>(`/settings/pricing/${id}`, config);
    return response.data;
  }

  async getGlobalSettings(): Promise<GlobalSettings> {
    const response = await apiService.get<GlobalSettings>('/settings/global');
    return response.data;
  }

  async updateGlobalSettings(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const response = await apiService.put<GlobalSettings>('/settings/global', settings);
    return response.data;
  }
}

// Service de gestion des logs d'audit
export class AuditService {
  async getAuditLogs(page: number = 1, limit: number = 10, category?: string): Promise<PaginatedResponse<AuditLog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    
    const response = await apiService.get<PaginatedResponse<AuditLog>>(`/audit/logs?${params}`);
    return response.data;
  }

  async getAuditLogById(id: number): Promise<AuditLog> {
    const response = await apiService.get<AuditLog>(`/audit/logs/${id}`);
    return response.data;
  }
}

// Service Hedera Hashgraph
export class HederaService {
  async getNetworkStatus(): Promise<{ status: string; latency: number; nodes: number }> {
    const response = await apiService.get<{ status: string; latency: number; nodes: number }>('/hedera/network-status');
    return response.data;
  }

  async getAccountBalance(accountId: string): Promise<{ balance: number; currency: string }> {
    const response = await apiService.get<{ balance: number; currency: string }>(`/hedera/balance/${accountId}`);
    return response.data;
  }

  async getTransactions(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Record<string, unknown>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<PaginatedResponse<Record<string, unknown>>>(`/hedera/transactions?${params}`);
    return response.data;
  }
}

// Export des instances de services
export const authService = new AuthService();
export const userService = new UserService();
export const orderService = new OrderService();
export const productService = new ProductService();
export const disputeService = new DisputeService();
export const financialService = new FinancialService();
export const logisticsService = new LogisticsService();
export const reportService = new ReportService();
export const settingsService = new SettingsService();
export const auditService = new AuditService();
export const hederaService = new HederaService();
