// Composants UI réutilisables pour AGRILEND
import React from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, 
  Loader2, Search, Filter
} from 'lucide-react';

// Interface pour les props de base
interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Composant de bouton avec variantes
interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white hover:shadow-lg focus:ring-[#4CAF50]',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Composant de badge avec variantes
interface BadgeProps extends BaseProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// Composant de carte
interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  hover = false,
  className = ''
}) => {
  const hoverClasses = hover ? 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${hoverClasses} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// Composant de statut avec icône
interface StatusProps extends BaseProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text: string;
}

export const Status: React.FC<StatusProps> = ({
  status,
  text,
  className = ''
}) => {
  const statusConfig = {
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    warning: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
    pending: { icon: Loader2, color: 'text-gray-600', bg: 'bg-gray-50' }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${config.bg} ${className}`}>
      <Icon className={`w-4 h-4 mr-2 ${config.color} ${status === 'pending' ? 'animate-spin' : ''}`} />
      <span className={`text-sm font-medium ${config.color}`}>{text}</span>
    </div>
  );
};

// Composant de barre de progression
interface ProgressBarProps extends BaseProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF]',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Composant de recherche
interface SearchInputProps extends BaseProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  loading?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Rechercher...',
  value,
  onChange,
  onSearch,
  loading = false,
  className = ''
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
};

// Composant de filtre (Dropdown Select)
interface FilterButtonProps extends BaseProps {
  options: { value: string; label: string; }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  active?: boolean; // Keep active for styling if needed
  count?: number; // Keep count for styling if needed
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Filtrer...',
  active = false, // Not directly used in select, but kept for consistency
  count, // Not directly used in select, but kept for consistency
  className = ''
}) => {
  const activeClasses = active 
    ? 'bg-[#4CAF50] text-white' 
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <div className={`relative inline-flex items-center rounded-lg ${className}`}>
      <Filter className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent ${activeClasses}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Optional: Display count as a badge if needed, but not directly part of select */}
      {count !== undefined && (
        <Badge variant="default" size="sm" className="ml-2 absolute right-2">
          {count}
        </Badge>
      )}
    </div>
  );
};

// Composant de pagination
interface PaginationProps extends BaseProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showInfo && totalItems && (
        <div className="text-sm text-gray-700">
          Affichage de {startItem} à {endItem} sur {totalItems} résultats
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Précédent
        </Button>
        
        {getPageNumbers().map(page => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

// Composant de skeleton pour le chargement
interface SkeletonProps extends BaseProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = true,
  className = ''
}) => {
  const roundedClasses = rounded ? 'rounded' : '';
  
  return (
    <div className={`animate-pulse bg-gray-200 ${width} ${height} ${roundedClasses} ${className}`} />
  );
};

// Composant de skeleton pour les cartes
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width="w-32" height="h-6" />
            <Skeleton width="w-16" height="h-4" />
          </div>
          <Skeleton width="w-full" height="h-8" className="mb-2" />
          <Skeleton width="w-3/4" height="h-4" />
        </Card>
      ))}
    </>
  );
};

// Composant de skeleton pour les tableaux
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="w-full" height="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Composant de bouton d'action
interface ActionButtonProps extends BaseProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-[#4CAF50] text-white hover:bg-[#45a049]',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600',
    warning: 'bg-orange-500 text-white hover:bg-orange-600',
    error: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

// Composant de tooltip
interface TooltipProps extends BaseProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50`}>
        <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`} />
        </div>
      </div>
    </div>
  );
};