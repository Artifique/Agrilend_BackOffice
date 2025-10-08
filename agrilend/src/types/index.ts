// Types globaux pour AGRILEND
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  ordersCount: number;
  createdAt: string;
  lastLogin?: string;
  location?: string;
  verified: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  offerId: number;
  orderedQuantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'PENDING' | 'IN_ESCROW' | 'RELEASED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DISPUTED';
  deliveryAddress: string;
  notes: string | null;
  productName: string;
  productUnit: string;
  farmerId: number;
  farmerName: string;
  buyerId: number;
  buyerName: string;
  buyerEmail: string;
  escrowTransactionId: string | null;
  escrowStartDate: string | null;
  escrowEndDate: string | null;
  createdAt: string;
  updatedAt: string;

  // Garder certains champs optionnels pour la compatibilité avec les modales existantes
  description?: string;
  platformFee?: number;
  actualDeliveryDate?: string;
  expectedDeliveryDate?: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface Dispute {
  id: number;
  farmer: string;
  buyer: string;
  orderId: number;
  productType: string;
  category: 'non-delivery' | 'cancellation' | 'quality' | 'payment' | 'logistics' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  hederaTxId?: string;
}

export interface FinancialTransaction {
  id: number;
  orderId: number;
  type: 'escrow' | 'release' | 'refund' | 'commission' | 'staking';
  amount: number;
  currency: 'EUR' | 'USD' | 'XOF';
  status: 'pending' | 'completed' | 'failed';
  hederaTxId: string;
  timestamp: string;
  fees?: number;
  stakingReward?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string; // Type ajusté pour correspondre au JSON
  subcategory: string;
  unit: string; // Type ajusté pour correspondre au JSON
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}



export interface PricingConfig {
  id: string;
  category: string;
  basePrice: number;
  commissionRate: number;
  marginRate: number;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
}

export interface GlobalSettings {
  platformCommission: number;
  stakingRewardRate: number;
  sequesterDuration: number;
  latePaymentFee: number;
  currency: 'EUR' | 'USD' | 'XOF';
  taxRate: number;
}

export interface AuditLog {
  id: number;
  action: string;
  category: 'auth' | 'order' | 'payment' | 'product' | 'kyc' | 'staking' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: number;
  userRole?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  hederaTxId?: string;
}

export interface DashboardMetrics {
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

export interface ChartData {
  mois: string;
  commandes: number;
  livrees: number;
  revenus: number;
  sequestres: number;
  annulees: number;
}

export interface ProductData {
  name: string;
  value: number;
  color: string;
  amount: number;
}

export interface BlockchainData {
  jour: string;
  transactions: number;
  sequestres: number;
  staking: number;
  latence: number;
}

export interface Alert {
  id: number;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Types pour les formulaires
export interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  rows?: number;
  options?: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
}

// Types pour les modals
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// Types pour les tables
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  showActions?: boolean;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

// Types pour l'authentification
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  token: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Types pour les API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Delivery {
  id: number;
  orderId: number;
  product: string;
  farmer: string;
  buyer: string;
  quantity: number;
  pickupLocation: string;
  deliveryLocation: string;
  scheduledDate: string;
  driver: string;
  vehicle: string;
  status: 'SCHEDULED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  estimatedDuration: number;
  distance: number;
  cost: number;
  notes?: string;
  trackingId: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface LogisticsPartner {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  services: ('transport' | 'warehouse' | 'cold-storage' | 'packaging')[];
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  completedDeliveries: number;
  coverageAreas: string[];
  vehicles: number;
  certifications: string[];
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
