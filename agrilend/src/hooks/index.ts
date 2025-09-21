// Hooks personnalisés pour AGRILEND
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Hook pour la gestion des modals
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

// Hook pour la gestion des formulaires
export const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const handleChange = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);
  
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  const setFieldValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setError,
    setFieldValue,
    resetForm,
    isValid
  };
};

// Hook pour la gestion des tables
export const useTable = <T>(data: T[], initialPageSize: number = 10) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filtrage des données
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Tri des données
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  
  const handleSort = useCallback((field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);
  
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);
  
  return {
    data: paginatedData,
    totalItems: sortedData.length,
    currentPage,
    pageSize,
    totalPages,
    searchTerm,
    sortField,
    sortDirection,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch
  };
};

// Hook pour la gestion des notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>>([]);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification = { id, type, title, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

// Hook pour la gestion des données avec chargement
export const useAsyncData = <T>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch
  };
};

// Hook pour la gestion des états de chargement
export const useLoading = (initialState: boolean = false) => {
  const [loading, setLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  
  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  };
};

// Hook pour la gestion des erreurs
export const useError = () => {
  const [error, setError] = useState<string | null>(null);
  
  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Une erreur est survenue';
    setError(message);
  }, [setError]);
  
  return {
    error,
    setError: setErrorState,
    clearError,
    handleError
  };
};

// Hook pour la gestion des filtres
export const useFilters = <T extends Record<string, unknown>>(initialFilters: Partial<T> = {}) => {
  const [filters, setFilters] = useState<Partial<T>>(initialFilters);
  
  const updateFilter = useCallback((key: keyof T, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const removeFilter = useCallback((key: keyof T) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  const hasActiveFilters = Object.keys(filters).length > 0;
  
  return {
    filters,
    updateFilter,
    removeFilter,
    clearFilters,
    hasActiveFilters
  };
};

// Hook pour la gestion des préférences utilisateur
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('agrilend_preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'fr',
      pageSize: 10,
      autoRefresh: true,
      notifications: true
    };
  });
  
  const updatePreference = useCallback((key: string, value: unknown) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [key]: value };
      localStorage.setItem('agrilend_preferences', JSON.stringify(newPreferences));
      return newPreferences;
    });
  }, []);
  
  return {
    preferences,
    updatePreference
  };
};

// Hook pour la gestion des raccourcis clavier
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      
      // Format: 'ctrl+s', 'alt+n', etc.
      const shortcutKey = `${modifier ? 'ctrl+' : ''}${key}`;
      
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Hook pour la gestion des dimensions de fenêtre
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

// Hook pour la gestion des clics en dehors d'un élément
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);
  
  return ref;
};

// Hook pour la gestion des intervalles
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// Hook pour la gestion des timeouts
export const useTimeout = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
};

// Hook pour la navigation avec confirmation
export const useNavigationWithConfirmation = () => {
  const navigate = useNavigate();
  
  const navigateWithConfirmation = useCallback((
    path: string,
    message: string = 'Êtes-vous sûr de vouloir quitter cette page ?'
  ) => {
    if (window.confirm(message)) {
      navigate(path);
    }
  }, [navigate]);
  
  return { navigateWithConfirmation };
};
