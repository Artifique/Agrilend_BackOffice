// Composants de layout pour AGRILEND
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

// Composant de layout principal
export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Composant de layout pour les pages d'authentification
export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

// Composant de layout pour les modals
interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]} ${className}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de layout pour les pages avec sidebar
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header de page */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-3">{actions}</div>}
        </div>
      </div>
      
      {/* Contenu de la page */}
      {children}
    </div>
  );
};

// Composant de layout pour les cartes en grille
interface GridLayoutProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className = ''
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };
  
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };
  
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// Composant de layout pour les sections
interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

// Composant de layout pour les tableaux
interface TableLayoutProps {
  title?: string;
  subtitle?: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export const TableLayout: React.FC<TableLayoutProps> = ({
  title,
  subtitle,
  search,
  filters,
  actions,
  children,
  pagination,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}>
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      
      {/* Recherche et filtres */}
      {(search || filters) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between space-x-4">
            {search && (
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                  placeholder={search.placeholder || 'Rechercher...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>
            )}
            {filters && <div className="flex items-center space-x-2">{filters}</div>}
          </div>
        </div>
      )}
      
      {/* Contenu du tableau */}
      <div className="overflow-x-auto">
        {children}
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {pagination}
        </div>
      )}
    </div>
  );
};

// Composant de layout pour les formulaires
interface FormLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      
      {/* Contenu du formulaire */}
      <div className="space-y-6">
        {children}
      </div>
      
      {/* Actions */}
      {actions && (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          {actions}
        </div>
      )}
    </div>
  );
};

// Composant de layout pour les détails
interface DetailLayoutProps {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    color: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
  };
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  subtitle,
  status,
  actions,
  children,
  className = ''
}) => {
  const statusColors = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-3">
          {status && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status.color]}`}>
              {status.label}
            </span>
          )}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
      
      {/* Contenu */}
      {children}
    </div>
  );
};

// Composant de layout pour les statistiques
interface StatsLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const StatsLayout: React.FC<StatsLayoutProps> = ({
  title,
  subtitle,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
};

// Composant de layout pour les graphiques
interface ChartLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const ChartLayout: React.FC<ChartLayoutProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
};
