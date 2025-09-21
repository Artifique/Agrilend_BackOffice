import React, { useState } from 'react';
import { ArrowRight, CheckCircle, AlertTriangle, Users, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';

// Interface pour les pages à migrer
interface MigrationPage {
  id: string;
  name: string;
  oldFile: string;
  newFile: string;
  status: 'pending' | 'migrated' | 'in-progress';
  linesReduced: number;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}

// Composant de migration
const MigrationManager: React.FC = () => {
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<MigrationPage | null>(null);

  // Liste des pages à migrer
  const pagesToMigrate: MigrationPage[] = [
    {
      id: 'disputes',
      name: 'Gestion des Litiges',
      oldFile: 'DisputesManagement.tsx',
      newFile: 'DisputesManagementOptimized.tsx',
      status: 'migrated',
      linesReduced: 1046, // 1346 - 300
      features: [
        'Composant ManagementPage générique',
        'Actions spécialisées (assigner, résoudre, escalader)',
        'Hooks personnalisés pour la gestion des états',
        'Interface utilisateur améliorée',
        'Validation automatique des formulaires'
      ],
      icon: AlertCircle
    },
    {
      id: 'users',
      name: 'Gestion des Utilisateurs',
      oldFile: 'UsersManagement.tsx',
      newFile: 'UsersManagementOptimized.tsx',
      status: 'migrated',
      linesReduced: 424, // 724 - 300
      features: [
        'Composant ManagementPage générique',
        'Actions spécialisées (activer, désactiver, réinitialiser mot de passe)',
        'Gestion des rôles et permissions',
        'Profil utilisateur détaillé',
        'Statistiques en temps réel'
      ],
      icon: Users
    },
    {
      id: 'orders',
      name: 'Gestion des Commandes',
      oldFile: 'OrdersManagement.tsx',
      newFile: 'OrdersManagementOptimized.tsx',
      status: 'pending',
      linesReduced: 0,
      features: [
        'Composant ManagementPage générique',
        'Suivi des commandes en temps réel',
        'Gestion des livraisons',
        'Intégration Hedera Hashgraph',
        'Notifications automatiques'
      ],
      icon: AlertTriangle
    },
    {
      id: 'financial',
      name: 'Gestion Financière',
      oldFile: 'FinancialManagement.tsx',
      newFile: 'FinancialManagementOptimized.tsx',
      status: 'pending',
      linesReduced: 0,
      features: [
        'Composant ManagementPage générique',
        'Gestion des transactions HBAR',
        'Suivi des escrows',
        'Rapports financiers',
        'Intégration blockchain'
      ],
      icon: CheckCircle
    }
  ];

  const handleMigrate = (page: MigrationPage) => {
    setSelectedPage(page);
    setShowMigrationModal(true);
  };

  const handleMigrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPage) return;
    
    // Simulation de la migration
    console.log(`Migrating ${selectedPage.name}...`);
    
    // Ici, on pourrait :
    // 1. Créer automatiquement la nouvelle page optimisée
    // 2. Mettre à jour les routes
    // 3. Supprimer l'ancienne page
    // 4. Mettre à jour les imports
    
    setShowMigrationModal(false);
    setSelectedPage(null);
  };

  const getStatusColor = (status: MigrationPage['status']) => {
    switch (status) {
      case 'migrated': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: MigrationPage['status']) => {
    switch (status) {
      case 'migrated': return 'Migré';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Migration vers l'Architecture Optimisée</h1>
            <p className="text-blue-100">Migrez vos pages existantes vers la nouvelle architecture modulaire</p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-xl">
            <ArrowRight className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Statistiques de migration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pages Total</p>
              <p className="text-2xl font-bold text-gray-900">{pagesToMigrate.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Migrées</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagesToMigrate.filter(p => p.status === 'migrated').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagesToMigrate.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowRight className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lignes Réduites</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagesToMigrate.reduce((sum, p) => sum + p.linesReduced, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des pages à migrer */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pages à Migrer</h2>
          <p className="text-gray-600 mt-1">Cliquez sur une page pour voir les détails de la migration</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pagesToMigrate.map((page) => (
            <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 rounded-lg mr-4">
                    <page.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{page.name}</h3>
                    <p className="text-sm text-gray-600">
                      {page.oldFile} → {page.newFile}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                        {getStatusText(page.status)}
                      </span>
                      {page.linesReduced > 0 && (
                        <span className="ml-2 text-sm text-green-600">
                          -{page.linesReduced} lignes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {page.status === 'migrated' && (
                    <span className="text-green-600 text-sm font-medium">✓ Migré</span>
                  )}
                  {page.status === 'pending' && (
                    <button
                      onClick={() => handleMigrate(page)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Migrer
                    </button>
                  )}
                  {page.status === 'in-progress' && (
                    <span className="text-yellow-600 text-sm font-medium">En cours...</span>
                  )}
                </div>
              </div>
              
              {/* Fonctionnalités */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelles fonctionnalités :</h4>
                <div className="flex flex-wrap gap-2">
                  {page.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de migration */}
      <Modal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        title={`Migrer ${selectedPage?.name}`}
        size="lg"
      >
        {selectedPage && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Avantages de la migration :</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Réduction de {selectedPage.linesReduced} lignes de code</li>
                <li>• Architecture modulaire et réutilisable</li>
                <li>• Performance améliorée</li>
                <li>• Interface utilisateur cohérente</li>
                <li>• Maintenance simplifiée</li>
              </ul>
            </div>
            
            <ModalForm
              onSubmit={handleMigrationSubmit}
              onCancel={() => setShowMigrationModal(false)}
              submitText="Commencer la Migration"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options de migration
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Créer la nouvelle page optimisée</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Mettre à jour les routes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Sauvegarder l'ancienne page</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Supprimer l'ancienne page</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ajoutez un commentaire sur cette migration..."
                  />
                </div>
              </div>
            </ModalForm>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MigrationManager;
