// Composant de page générique pour les pages de gestion
import React, { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import DataTable from '../DataTable';
import { useModals, useEntityManagement, useNotifications } from '../../hooks/management';
import { EntityForm, ConfirmationModal, ViewModal, ActionBar } from '../management';

// Interface pour la configuration d'une page de gestion
interface ManagementPageConfig<T extends { id: number }> {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stats: Array<{
    label: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }>;
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    min?: string | number;
    max?: string | number;
    step?: string | number;
    rows?: number;
  }>;
  viewFields: Array<{
    key: string;
    label: string;
    type?: 'text' | 'date' | 'currency' | 'number' | 'status';
    format?: (value: unknown) => string;
  }>;
  columns: (columnHelper: ReturnType<typeof createColumnHelper<T>>) => ColumnDef<T>[];
  defaultFormData: Partial<T>;
  validationRules?: Record<string, (value: unknown) => string | null>;
}

// Composant de page de gestion générique
export const ManagementPage = <T extends { id: number }>({
  config,
  data,
  onRefresh,
  onExport
}: {
  config: ManagementPageConfig<T>;
  data: T[];
  onRefresh?: () => void;
  onExport?: () => void;
}) => {
  const { title, description, icon: Icon, stats, formFields, viewFields, columns, defaultFormData, validationRules } = config;
  
  // Hooks personnalisés
  const { openModal, closeModal, isModalOpen } = useModals({
    add: false,
    edit: false,
    view: false,
    delete: false
  });
  
  const { addNotification } = useNotifications();
  
  const {
    data: items,
    selectedItem,
    formData,
    isLoading,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useEntityManagement<T>(data, defaultFormData);

  // Configuration des colonnes du tableau
  const columnHelper = createColumnHelper<T>();
  const tableColumns = useMemo(() => columns(columnHelper), [columnHelper, columns]);

  // Handlers optimisés
  const handleAdd = () => {
    resetForm();
    openModal('add');
  };

  const handleSubmitCreate = async () => {
    await handleCreate(formData, () => {
      closeModal('add');
      addNotification('success', 'Succès', 'Élément ajouté avec succès !');
    });
  };

  const handleSubmitEdit = async () => {
    if (selectedItem) {
      await handleUpdate(selectedItem.id, formData, () => {
        closeModal('edit');
        addNotification('success', 'Succès', 'Élément modifié avec succès !');
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await handleDelete(selectedItem.id, () => {
        closeModal('delete');
        addNotification('success', 'Succès', 'Élément supprimé avec succès !');
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-blue-100">{description}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-xl">
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <StatIcon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre d'actions */}
      <ActionBar
        onAdd={handleAdd}
        onRefresh={onRefresh}
        onExport={onExport}
        addText={`Ajouter un ${title.toLowerCase()}`}
        showRefresh={!!onRefresh}
        showExport={!!onExport}
        showSearch={false}
      />

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <DataTable
          data={items}
          columns={tableColumns}
          searchPlaceholder={`Rechercher un ${title.toLowerCase()}...`}
          showSearch={true}
          showPagination={true}
          pageSize={10}
          showActions={true}
        />
      </div>

      {/* Modals */}
      <EntityForm
        isOpen={isModalOpen('add')}
        onClose={() => closeModal('add')}
        onSubmit={handleSubmitCreate}
        title={`Ajouter un ${title.toLowerCase()}`}
        isLoading={isLoading}
        submitText="Ajouter"
        fields={formFields}
        initialValues={formData}
        validationRules={validationRules}
      />

      <EntityForm
        isOpen={isModalOpen('edit')}
        onClose={() => closeModal('edit')}
        onSubmit={handleSubmitEdit}
        title={`Modifier le ${title.toLowerCase()}`}
        isLoading={isLoading}
        submitText="Modifier"
        fields={formFields}
        initialValues={formData}
        validationRules={validationRules}
      />

      <ViewModal
        isOpen={isModalOpen('view')}
        onClose={() => closeModal('view')}
        title={`Détails du ${title.toLowerCase()}`}
        data={selectedItem || {}}
        fields={viewFields}
      />

      <ConfirmationModal
        isOpen={isModalOpen('delete')}
        onClose={() => closeModal('delete')}
        onConfirm={handleConfirmDelete}
        title={`Supprimer le ${title.toLowerCase()}`}
        message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
