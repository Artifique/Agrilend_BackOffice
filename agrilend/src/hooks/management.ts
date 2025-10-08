import { useState, useCallback, useMemo, useEffect } from 'react';

// Hook pour la gestion des modals multiples
export const useModals = <T extends Record<string, boolean>>(initialModals: T) => {
  const [modals, setModals] = useState<T>(initialModals);
  
  const openModal = useCallback((modalName: keyof T) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);
  
  const closeModal = useCallback((modalName: keyof T) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);
  
  const closeAllModals = useCallback(() => {
    setModals(prev => {
      const closed = {} as T;
      for (const key in prev) {
        closed[key] = false as T[typeof key];
      }
      return closed;
    });
  }, []);
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen: (modalName: keyof T) => modals[modalName]
  };
};

// Hook pour la gestion des entités avec CRUD
export const useEntityManagement = <T extends { id: number }>(
  initialData: T[],
  defaultFormData: Partial<T>
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, [defaultFormData]);
  
  const handleCreate = useCallback(async (onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      // Simulation d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newItem = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      } as any as T;
      
      setData(prev => [...prev, newItem]);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, resetForm]);
  
  const handleUpdate = useCallback(async (id: number, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...formData } : item
      ));
      
      setSelectedItem(null);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, resetForm]);
  
  const handleDelete = useCallback(async (id: number, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(prev => prev.filter(item => item.id !== id));
      setSelectedItem(null);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleView = useCallback((item: T) => {
    setSelectedItem(item);
  }, []);
  
  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setFormData(item);
  }, []);
  
  return {
    data,
    selectedItem,
    formData,
    isLoading,
    setFormData,
    handleInputChange,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleView,
    handleEdit,
    setSelectedItem
  };
};

// Hook pour la gestion des formulaires avec validation
export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: unknown) => string | null>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof T;
    
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Validation en temps réel
    if (validationRules?.[fieldName]) {
      const validator = validationRules[fieldName];
      if (validator) {
        const error = validator(value);
        setErrors(prev => ({ ...prev, [fieldName]: error || undefined }));
      }
    }
  }, [validationRules]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof T;
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);
  
  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    if (validationRules) {
      for (const [field, validator] of Object.entries(validationRules)) {
        const fieldName = field as keyof T;
        if (validator) {
          const error = validator(values[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
          }
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.values(errors).every(error => !error);
  }, [errors]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues
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
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};

// Hook pour la gestion des tableaux avec tri et filtrage
export const useTableData = <T extends Record<string, unknown>>(
  data: T[],
  initialSortField?: keyof T,
  initialSortDirection: 'asc' | 'desc' = 'asc'
) => {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialSortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortedAndFilteredData = useMemo(() => {
    let filtered = data;
    
    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = data.filter(item => 
        Object.values(item as Record<string, unknown>).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Tri
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);
  
  const handleSort = useCallback((field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);
  
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);
  
  return {
    data: sortedAndFilteredData,
    sortField,
    sortDirection,
    searchTerm,
    handleSort,
    handleSearch
  };
};

// Hook pour la gestion des statistiques
export const useStatistics = <T extends Record<string, unknown>>(
  data: T[],
  getValue: (item: T) => number,
  getCategory?: (item: T) => string
) => {
  const statistics = useMemo(() => {
    const total = data.reduce((sum, item) => sum + getValue(item), 0);
    const average = data.length > 0 ? total / data.length : 0;
    
    let categories: Record<string, number> = {};
    if (getCategory) {
      categories = data.reduce((acc, item) => {
        const category = getCategory(item);
        acc[category] = (acc[category] || 0) + getValue(item);
        return acc;
      }, {} as Record<string, number>);
    }
    
    return {
      total,
      average,
      count: data.length,
      categories
    };
  }, [data, getValue, getCategory]);
  
  return statistics;
};
