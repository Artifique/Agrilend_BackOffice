// Constantes globales pour AGRILEND
export const APP_CONFIG = {
  name: 'AGRILEND',
  version: '1.0.0',
  description: 'Plateforme agricole blockchain pour la vente directe',
  url: 'https://agrilend.com',
  supportEmail: 'support@agrilend.com',
  supportPhone: '+225 20 30 40 50',
  companyAddress: 'Abidjan, Côte d\'Ivoire',
  businessHours: 'Lundi - Vendredi: 8h00 - 18h00'
} as const;

export const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  SEQUESTERED: 'sequestered',
  RELEASED: 'released',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const DISPUTE_CATEGORIES = {
  NON_DELIVERY: 'non-delivery',
  CANCELLATION: 'cancellation',
  QUALITY: 'quality',
  PAYMENT: 'payment',
  LOGISTICS: 'logistics',
  OTHER: 'other'
} as const;

export const DISPUTE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const DISPUTE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const PRODUCT_CATEGORIES = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  LIVESTOCK: 'livestock',
  OTHER: 'other'
} as const;

export const PRODUCT_UNITS = {
  KG: 'kg',
  PIECE: 'piece',
  TON: 'ton',
  BOX: 'box'
} as const;

export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD',
  XOF: 'XOF'
} as const;

export const TRANSACTION_TYPES = {
  ESCROW: 'escrow',
  RELEASE: 'release',
  REFUND: 'refund',
  COMMISSION: 'commission',
  STAKING: 'staking'
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export const DELIVERY_STATUS = {
  SCHEDULED: 'scheduled',
  IN_TRANSIT: 'in-transit',
  DELIVERED: 'delivered',
  FAILED: 'failed'
} as const;

export const AUDIT_CATEGORIES = {
  AUTH: 'auth',
  ORDER: 'order',
  PAYMENT: 'payment',
  PRODUCT: 'product',
  KYC: 'kyc',
  STAKING: 'staking',
  SYSTEM: 'system'
} as const;

export const AUDIT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const ALERT_TYPES = {
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const MODAL_TYPES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export const MODAL_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    BY_ROLE: '/users/role/:role'
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    DELETE: '/orders/:id',
    BY_STATUS: '/orders/status/:status'
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    VALIDATE: '/products/:id/validate'
  },
  DISPUTES: {
    LIST: '/disputes',
    CREATE: '/disputes',
    UPDATE: '/disputes/:id',
    DELETE: '/disputes/:id',
    ASSIGN: '/disputes/:id/assign',
    RESOLVE: '/disputes/:id/resolve'
  },
  FINANCIAL: {
    TRANSACTIONS: '/financial/transactions',
    ESCROW: '/financial/escrow',
    RELEASE: '/financial/release',
    STAKING: '/financial/staking'
  },
  LOGISTICS: {
    DELIVERIES: '/logistics/deliveries',
    CREATE: '/logistics/deliveries',
    UPDATE: '/logistics/deliveries/:id',
    TRACK: '/logistics/deliveries/:id/track'
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    SALES: '/reports/sales',
    USERS: '/reports/users',
    FINANCIAL: '/reports/financial'
  },
  HEDERA: {
    TRANSACTIONS: '/hedera/transactions',
    ACCOUNTS: '/hedera/accounts',
    BALANCE: '/hedera/balance',
    NETWORK_STATUS: '/hedera/network-status'
  }
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  ORDERS: '/orders',
  PRODUCTS: '/products-validation',
  FINANCIAL: '/financial',
  LOGISTICS: '/logistics',
  DISPUTES: '/disputes',
  REPORTS: '/reports',
  PARAMETERS: '/parameters'
} as const;

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

export const FORM_VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[0-9\s\-()]{8,}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
} as const;

export const HEDERA_CONFIG = {
  NETWORK: 'testnet', // ou 'mainnet' en production
  ACCOUNT_ID: import.meta.env.VITE_HEDERA_ACCOUNT_ID || '0.0.1234567',
  PRIVATE_KEY: import.meta.env.VITE_HEDERA_PRIVATE_KEY || '',
  TOKEN_ID: import.meta.env.VITE_HEDERA_TOKEN_ID || '0.0.7654321',
  COMMISSION_RATE: 0.05, // 5%
  STAKING_REWARD_RATE: 0.02, // 2%
  ESCROW_DURATION_DAYS: 7
} as const;

export const CHART_COLORS = {
  PRIMARY: '#4CAF50',
  SECONDARY: '#1E90FF',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  PURPLE: '#9C27B0',
  GRAY: '#607D8B'
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'agrilend_auth_token',
  USER_DATA: 'agrilend_user_data',
  THEME: 'agrilend_theme',
  LANGUAGE: 'agrilend_language',
  DASHBOARD_CONFIG: 'agrilend_dashboard_config'
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Erreur de validation',
  SERVER_ERROR: 'Erreur serveur interne',
  UNKNOWN_ERROR: 'Erreur inconnue'
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  SAVE_SUCCESS: 'Sauvegarde réussie',
  DELETE_SUCCESS: 'Suppression réussie',
  UPDATE_SUCCESS: 'Mise à jour réussie',
  CREATE_SUCCESS: 'Création réussie'
} as const;
