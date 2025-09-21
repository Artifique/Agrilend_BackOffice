// Utilitaires pour AGRILEND
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formatage des devises
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formatage des nombres
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// Formatage des pourcentages
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

// Formatage des dates
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Date invalide';
    return format(dateObj, formatStr, { locale: fr });
  } catch {
    return 'Date invalide';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Date invalide';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    
    return formatDate(dateObj, 'dd/MM/yyyy');
  } catch {
    return 'Date invalide';
  }
};

// Validation des emails
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des téléphones
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/;
  return phoneRegex.test(phone);
};

// Validation des mots de passe
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

// Génération d'ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Génération de numéro de commande
export const generateOrderNumber = (): string => {
  const prefix = 'AGR';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Génération de numéro de suivi
export const generateTrackingNumber = (): string => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}${timestamp}`;
};

// Calcul des frais de plateforme
export const calculatePlatformFee = (amount: number, rate: number = 0.05): number => {
  return Math.round(amount * rate * 100) / 100;
};

// Calcul du montant total avec frais
export const calculateTotalWithFees = (amount: number, feeRate: number = 0.05): number => {
  const fee = calculatePlatformFee(amount, feeRate);
  return amount + fee;
};

// Calcul des récompenses de staking
export const calculateStakingReward = (amount: number, rate: number = 0.02, days: number = 7): number => {
  const dailyRate = rate / 365;
  return Math.round(amount * dailyRate * days * 100) / 100;
};

// Formatage des tailles de fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Clonage profond
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

// Vérification si un objet est vide
export const isEmpty = (obj: unknown): boolean => {
  if (obj == null) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Capitalisation de la première lettre
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalisation de chaque mot
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Conversion de camelCase en kebab-case
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Conversion de kebab-case en camelCase
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
};

// Génération de couleurs aléatoires
export const generateRandomColor = (): string => {
  const colors = [
    '#4CAF50', '#1E90FF', '#FF9800', '#F44336', '#9C27B0',
    '#607D8B', '#795548', '#E91E63', '#00BCD4', '#8BC34A'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Calcul de la différence entre deux dates
export const getDateDifference = (date1: Date, date2: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// Vérification si une date est dans le passé
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

// Vérification si une date est dans le futur
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
};

// Génération d'un hash simple
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Extraction des initiales d'un nom
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Validation des URLs
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Formatage des adresses
export const formatAddress = (address: string): string => {
  return address.replace(/,/g, ', ').trim();
};

// Génération de mots de passe sécurisés
export const generateSecurePassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Masquage des données sensibles
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) return '*'.repeat(data.length);
  const visible = data.substring(0, visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return visible + masked;
};

// Vérification de la force d'un mot de passe
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon', 'Excellent'];
  const colors = ['#F44336', '#FF9800', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];
  
  return {
    score: Math.min(score, 5),
    label: labels[Math.min(score, 5)],
    color: colors[Math.min(score, 5)]
  };
};
