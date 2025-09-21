// Store global avec Zustand pour AGRILEND
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  User, Order, Dispute, Product, Delivery, FinancialTransaction,
  PricingConfig, GlobalSettings, DashboardMetrics, AuthUser 
} from '../types';

// Interface pour l'état d'authentification
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des utilisateurs
interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  removeUser: (id: number) => void;
  setSelectedUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des commandes
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: number, order: Partial<Order>) => void;
  removeOrder: (id: number) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des produits
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des litiges
interface DisputeState {
  disputes: Dispute[];
  selectedDispute: Dispute | null;
  isLoading: boolean;
  error: string | null;
  setDisputes: (disputes: Dispute[]) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (id: number, dispute: Partial<Dispute>) => void;
  removeDispute: (id: number) => void;
  setSelectedDispute: (dispute: Dispute | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des livraisons
interface DeliveryState {
  deliveries: Delivery[];
  selectedDelivery: Delivery | null;
  isLoading: boolean;
  error: string | null;
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: number, delivery: Partial<Delivery>) => void;
  removeDelivery: (id: number) => void;
  setSelectedDelivery: (delivery: Delivery | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état financier
interface FinancialState {
  transactions: FinancialTransaction[];
  isLoading: boolean;
  error: string | null;
  setTransactions: (transactions: FinancialTransaction[]) => void;
  addTransaction: (transaction: FinancialTransaction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état des paramètres
interface SettingsState {
  pricingConfigs: PricingConfig[];
  globalSettings: GlobalSettings | null;
  isLoading: boolean;
  error: string | null;
  setPricingConfigs: (configs: PricingConfig[]) => void;
  updatePricingConfig: (id: string, config: Partial<PricingConfig>) => void;
  setGlobalSettings: (settings: GlobalSettings) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Interface pour l'état du dashboard
interface DashboardState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setMetrics: (metrics: DashboardMetrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: string) => void;
}

// Interface pour l'état des notifications
interface NotificationState {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>;
  addNotification: (notification: Omit<NotificationState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Interface pour l'état des modals
interface ModalState {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
}

// Store d'authentification
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      () => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (email: string) => {
          set({ isLoading: true, error: null });
          try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockUser: AuthUser = {
              id: 1,
              name: 'Admin AGRILEND',
              email: email,
              role: 'admin',
              token: 'mock-token-' + Date.now()
            };
            
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch {
            set({ 
              error: 'Erreur de connexion', 
              isLoading: false 
            });
          }
        },
        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        },
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error })
      }),
      {
        name: 'agrilend-auth',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        })
      }
    ),
    { name: 'auth-store' }
  )
);

// Store des utilisateurs
export const useUserStore = create<UserState>()(
  devtools(
    () => ({
      users: [],
      selectedUser: null,
      isLoading: false,
      error: null,
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ 
        users: [...state.users, user] 
      })),
      updateUser: (id, userData) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        )
      })),
      removeUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'user-store' }
  )
);

// Store des commandes
export const useOrderStore = create<OrderState>()(
  devtools(
    () => ({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, order] 
      })),
      updateOrder: (id, orderData) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === id ? { ...order, ...orderData } : order
        )
      })),
      removeOrder: (id) => set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      })),
      setSelectedOrder: (order) => set({ selectedOrder: order }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'order-store' }
  )
);

// Store des produits
export const useProductStore = create<ProductState>()(
  devtools(
    () => ({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ 
        products: [...state.products, product] 
      })),
      updateProduct: (id, productData) => set((state) => ({
        products: state.products.map(product => 
          product.id === id ? { ...product, ...productData } : product
        )
      })),
      removeProduct: (id) => set((state) => ({
        products: state.products.filter(product => product.id !== id)
      })),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'product-store' }
  )
);

// Store des litiges
export const useDisputeStore = create<DisputeState>()(
  devtools(
    () => ({
      disputes: [],
      selectedDispute: null,
      isLoading: false,
      error: null,
      setDisputes: (disputes) => set({ disputes }),
      addDispute: (dispute) => set((state) => ({ 
        disputes: [...state.disputes, dispute] 
      })),
      updateDispute: (id, disputeData) => set((state) => ({
        disputes: state.disputes.map(dispute => 
          dispute.id === id ? { ...dispute, ...disputeData } : dispute
        )
      })),
      removeDispute: (id) => set((state) => ({
        disputes: state.disputes.filter(dispute => dispute.id !== id)
      })),
      setSelectedDispute: (dispute) => set({ selectedDispute: dispute }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'dispute-store' }
  )
);

// Store des livraisons
export const useDeliveryStore = create<DeliveryState>()(
  devtools(
    () => ({
      deliveries: [],
      selectedDelivery: null,
      isLoading: false,
      error: null,
      setDeliveries: (deliveries) => set({ deliveries }),
      addDelivery: (delivery) => set((state) => ({ 
        deliveries: [...state.deliveries, delivery] 
      })),
      updateDelivery: (id, deliveryData) => set((state) => ({
        deliveries: state.deliveries.map(delivery => 
          delivery.id === id ? { ...delivery, ...deliveryData } : delivery
        )
      })),
      removeDelivery: (id) => set((state) => ({
        deliveries: state.deliveries.filter(delivery => delivery.id !== id)
      })),
      setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'delivery-store' }
  )
);

// Store financier
export const useFinancialStore = create<FinancialState>()(
  devtools(
    () => ({
      transactions: [],
      isLoading: false,
      error: null,
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) => set((state) => ({ 
        transactions: [...state.transactions, transaction] 
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    { name: 'financial-store' }
  )
);

// Store des paramètres
export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      () => ({
        pricingConfigs: [],
        globalSettings: null,
        isLoading: false,
        error: null,
        setPricingConfigs: (configs) => set({ pricingConfigs: configs }),
        updatePricingConfig: (id, config) => set((state) => ({
          pricingConfigs: state.pricingConfigs.map(c => 
            c.id === id ? { ...c, ...config } : c
          )
        })),
        setGlobalSettings: (settings) => set({ globalSettings: settings }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error })
      }),
      {
        name: 'agrilend-settings',
        partialize: (state) => ({ 
          pricingConfigs: state.pricingConfigs,
          globalSettings: state.globalSettings
        })
      }
    ),
    { name: 'settings-store' }
  )
);

// Store du dashboard
export const useDashboardStore = create<DashboardState>()(
  devtools(
    () => ({
      metrics: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      setMetrics: (metrics) => set({ 
        metrics, 
        lastUpdated: new Date().toISOString() 
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setLastUpdated: (date) => set({ lastUpdated: date })
    }),
    { name: 'dashboard-store' }
  )
);

// Store des notifications
export const useNotificationStore = create<NotificationState>()(
  devtools(
    () => ({
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto-remove after duration
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] })
    }),
    { name: 'notification-store' }
  )
);

// Store des modals
export const useModalStore = create<ModalState>()(
  devtools(
    () => ({
      modals: {},
      openModal: (id) => set((state) => ({
        modals: { ...state.modals, [id]: true }
      })),
      closeModal: (id) => set((state) => ({
        modals: { ...state.modals, [id]: false }
      })),
      toggleModal: (id) => set((state) => ({
        modals: { 
          ...state.modals, 
          [id]: !state.modals[id] 
        }
      })),
      isModalOpen: (id) => get().modals[id] || false
    }),
    { name: 'modal-store' }
  )
);

// Store combiné pour les actions globales
export const useAppStore = create<{
  resetAllStores: () => void;
  getStoreStats: () => Record<string, number>;
}>()(
  devtools(
    () => ({
      resetAllStores: () => {
        useAuthStore.getState().logout();
        useUserStore.getState().setUsers([]);
        useOrderStore.getState().setOrders([]);
        useProductStore.getState().setProducts([]);
        useDisputeStore.getState().setDisputes([]);
        useDeliveryStore.getState().setDeliveries([]);
        useFinancialStore.getState().setTransactions([]);
        useDashboardStore.getState().setMetrics(null);
        useNotificationStore.getState().clearNotifications();
        useModalStore.getState().modals = {};
      },
      getStoreStats: () => {
        return {
          users: useUserStore.getState().users.length,
          orders: useOrderStore.getState().orders.length,
          products: useProductStore.getState().products.length,
          disputes: useDisputeStore.getState().disputes.length,
          deliveries: useDeliveryStore.getState().deliveries.length,
          transactions: useFinancialStore.getState().transactions.length,
          notifications: useNotificationStore.getState().notifications.length
        };
      }
    }),
    { name: 'app-store' }
  )
);
