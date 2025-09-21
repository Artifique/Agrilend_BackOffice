import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Shield, Bell, CreditCard, Users, Database, Key, Percent, Calculator } from 'lucide-react';
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';
import { useConfirmationHelpers } from '../hooks/useConfirmationHelpers';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: ConfigItem[];
}

interface ConfigItem {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'email' | 'phone';
  value: string | number | boolean;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface PricingConfig {
  id: string;
  category: string;
  basePrice: number;
  commissionRate: number;
  marginRate: number;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
}

const ParametersConfig: React.FC = () => {
  const { showSuccess } = useNotificationHelpers();
  const { confirmReset } = useConfirmationHelpers();
  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePricingTab, setActivePricingTab] = useState('commissions');
  
  // Configuration des prix
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([
    {
      id: 'vegetables',
      category: 'Légumes',
      basePrice: 2.0,
      commissionRate: 5.0,
      marginRate: 15.0,
      minPrice: 1.0,
      maxPrice: 5.0,
      isActive: true
    },
    {
      id: 'fruits',
      category: 'Fruits',
      basePrice: 1.8,
      commissionRate: 5.0,
      marginRate: 12.0,
      minPrice: 0.8,
      maxPrice: 4.0,
      isActive: true
    },
    {
      id: 'grains',
      category: 'Céréales',
      basePrice: 1.5,
      commissionRate: 4.0,
      marginRate: 10.0,
      minPrice: 0.5,
      maxPrice: 3.0,
      isActive: true
    },
    {
      id: 'livestock',
      category: 'Élevage',
      basePrice: 8.0,
      commissionRate: 6.0,
      marginRate: 20.0,
      minPrice: 5.0,
      maxPrice: 15.0,
      isActive: true
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    platformCommission: 5.0,
    stakingRewardRate: 2.0,
    sequesterDuration: 7, // jours
    latePaymentFee: 2.5,
    currency: 'EUR',
    taxRate: 0.0
  });

  // Fonctions pour les actions rapides - optimisées
  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    // Utilisation d'un délai optimisé pour une meilleure UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setHasChanges(false);
    setIsSaving(false);
    showSuccess('Succès', 'Configuration sauvegardée avec succès !');
  };

  const handleResetConfiguration = () => {
    confirmReset(() => {
      setHasChanges(false);
      showSuccess('Succès', 'Configuration réinitialisée avec succès !');
    });
  };

  const handleExportConfiguration = () => {
    const config = {
      general: { /* Configuration générale */ },
      security: { /* Configuration sécurité */ },
      notifications: { /* Configuration notifications */ },
      system: { /* Configuration système */ },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `agrilent-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess('Succès', 'Configuration exportée avec succès !');
  };

  const configSections: ConfigSection[] = [
    {
      id: 'general',
      title: 'Paramètres Généraux',
      description: 'Configuration de base de la plateforme',
      icon: Settings,
      settings: [
        {
          id: 'platform_name',
          label: 'Nom de la plateforme',
          description: 'Nom affiché sur l\'interface utilisateur',
          type: 'text',
          value: 'Agrilent',
          required: true
        },
        {
          id: 'platform_url',
          label: 'URL de la plateforme',
          description: 'Adresse web principale de la plateforme',
          type: 'text',
          value: 'https://agrilent.com',
          required: true
        },
        {
          id: 'default_language',
          label: 'Langue par défaut',
          description: 'Langue d\'affichage par défaut',
          type: 'select',
          value: 'fr',
          options: [
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' }
          ]
        },
        {
          id: 'timezone',
          label: 'Fuseau horaire',
          description: 'Fuseau horaire utilisé par la plateforme',
          type: 'select',
          value: 'Africa/Abidjan',
          options: [
            { value: 'Africa/Abidjan', label: 'Abidjan (GMT+0)' },
            { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
            { value: 'Europe/Paris', label: 'Paris (GMT+1)' }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Paramètres de sécurité et authentification',
      icon: Shield,
      settings: [
        {
          id: 'password_min_length',
          label: 'Longueur minimale du mot de passe',
          description: 'Nombre minimum de caractères requis',
          type: 'number',
          value: 8,
          required: true
        },
        {
          id: 'session_timeout',
          label: 'Délai d\'expiration de session (minutes)',
          description: 'Durée avant déconnexion automatique',
          type: 'number',
          value: 30
        },
        {
          id: 'two_factor_auth',
          label: 'Authentification à deux facteurs',
          description: 'Activer l\'authentification à deux facteurs',
          type: 'boolean',
          value: true
        },
        {
          id: 'login_attempts_limit',
          label: 'Limite de tentatives de connexion',
          description: 'Nombre maximum de tentatives avant blocage',
          type: 'number',
          value: 5
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configuration des notifications et alertes',
      icon: Bell,
      settings: [
        {
          id: 'email_notifications',
          label: 'Notifications par email',
          description: 'Activer l\'envoi d\'emails de notification',
          type: 'boolean',
          value: true
        },
        {
          id: 'sms_notifications',
          label: 'Notifications SMS',
          description: 'Activer l\'envoi de SMS de notification',
          type: 'boolean',
          value: false
        },
        {
          id: 'push_notifications',
          label: 'Notifications push',
          description: 'Activer les notifications push dans l\'application',
          type: 'boolean',
          value: true
        },
        {
          id: 'notification_frequency',
          label: 'Fréquence des notifications',
          description: 'À quelle fréquence envoyer les notifications',
          type: 'select',
          value: 'immediate',
          options: [
            { value: 'immediate', label: 'Immédiate' },
            { value: 'hourly', label: 'Horaire' },
            { value: 'daily', label: 'Quotidienne' }
          ]
        }
      ]
    },
    {
      id: 'financial',
      title: 'Paramètres Financiers',
      description: 'Configuration des taux et limites financières',
      icon: CreditCard,
      settings: [
        {
          id: 'default_interest_rate',
          label: 'Taux d\'intérêt par défaut (%)',
          description: 'Taux d\'intérêt appliqué par défaut aux nouveaux prêts',
          type: 'number',
          value: 8.5,
          required: true
        },
        {
          id: 'max_loan_amount',
          label: 'Montant maximum de prêt (€)',
          description: 'Limite supérieure pour les prêts',
          type: 'number',
          value: 50000
        },
        {
          id: 'min_loan_amount',
          label: 'Montant minimum de prêt (€)',
          description: 'Limite inférieure pour les prêts',
          type: 'number',
          value: 1000
        },
        {
          id: 'late_fee_percentage',
          label: 'Frais de retard (%)',
          description: 'Pourcentage appliqué en cas de retard de paiement',
          type: 'number',
          value: 2.5
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Configuration des Prix',
      description: 'Gestion des tarifs, marges et commissions',
      icon: Percent,
      settings: []
    },
    {
      id: 'contact',
      title: 'Informations de Contact',
      description: 'Coordonnées et informations de contact',
      icon: Users,
      settings: [
        {
          id: 'support_email',
          label: 'Email de support',
          description: 'Adresse email pour le support client',
          type: 'email',
          value: 'support@agrilent.com',
          required: true
        },
        {
          id: 'support_phone',
          label: 'Téléphone de support',
          description: 'Numéro de téléphone pour le support client',
          type: 'phone',
          value: '+225 20 30 40 50'
        },
        {
          id: 'company_address',
          label: 'Adresse de l\'entreprise',
          description: 'Adresse physique de l\'entreprise',
          type: 'text',
          value: 'Abidjan, Côte d\'Ivoire'
        },
        {
          id: 'business_hours',
          label: 'Heures d\'ouverture',
          description: 'Horaires de fonctionnement',
          type: 'text',
          value: 'Lundi - Vendredi: 8h00 - 18h00'
        }
      ]
    }
  ];

  const handleConfigChange = () => {
    setHasChanges(true);
    // Ici vous pouvez implémenter la logique de mise à jour des paramètres
  };

  const handlePricingChange = (id: string, field: keyof PricingConfig, value: number | boolean) => {
    setPricingConfigs(prev => 
      prev.map(config => 
        config.id === id ? { ...config, [field]: value } : config
      )
    );
    setHasChanges(true);
  };

  const handleGlobalSettingChange = (field: keyof typeof globalSettings, value: number | string) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const calculateTotalCommission = (config: PricingConfig) => {
    return (config.basePrice * config.commissionRate) / 100;
  };

  const calculateTotalMargin = (config: PricingConfig) => {
    return (config.basePrice * config.marginRate) / 100;
  };

  const calculateFinalPrice = (config: PricingConfig) => {
    return config.basePrice + calculateTotalCommission(config) + calculateTotalMargin(config);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsSaving(false);
    setHasChanges(false);
  };

  const activeConfig = configSections.find(section => section.id === activeSection);

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold mb-2">Configuration de la Plateforme</h1>
            <p className="text-white/90 text-lg">Gérez tous les paramètres de votre plateforme agricole</p>
        </div>
          <div className="flex items-center space-x-3">
          {hasChanges && (
              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-orange-200 text-sm font-medium">Modifications non sauvegardées</span>
              </div>
          )}
          <button
            onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                hasChanges && !isSaving 
                  ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30' 
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
          </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des sections */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
            <nav className="space-y-2">
              {configSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      activeSection === section.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium">{section.title}</p>
                      <p className={`text-xs ${
                        activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {section.description}
                      </p>
              </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu de la section active */}
        <div className="lg:col-span-3">
          {activeConfig && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-xl mr-4">
                  <activeConfig.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeConfig.title}</h2>
                  <p className="text-gray-600">{activeConfig.description}</p>
        </div>
            </div>

              {/* Contenu spécial pour la configuration des prix */}
              {activeConfig.id === 'pricing' ? (
                <div className="space-y-6">
                  {/* Onglets pour la configuration des prix */}
                  <div className="flex space-x-1 mb-6">
                    <button
                      onClick={() => setActivePricingTab('commissions')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        activePricingTab === 'commissions'
                          ? 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Percent className="h-4 w-4 mr-2 inline" />
                      Commissions par Catégorie
                    </button>
                    <button
                      onClick={() => setActivePricingTab('global')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        activePricingTab === 'global'
                          ? 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2 inline" />
                      Paramètres Globaux
                    </button>
                    <button
                      onClick={() => setActivePricingTab('calculator')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        activePricingTab === 'calculator'
                          ? 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Calculator className="h-4 w-4 mr-2 inline" />
                      Calculateur de Prix
                    </button>
                    <button
                      onClick={() => setActivePricingTab('margins')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        activePricingTab === 'margins'
                          ? 'bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4 mr-2 inline" />
                      Gestion des Marges
                    </button>
                  </div>

                  {/* Contenu des onglets de prix */}
                  {activePricingTab === 'commissions' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pricingConfigs.map((config) => (
                          <div key={config.id} className="border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">{config.category}</h3>
                              <div className="flex items-center">
                                <button
                                  onClick={() => handlePricingChange(config.id, 'isActive', !config.isActive)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                    config.isActive ? 'bg-[#4CAF50]' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                      config.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className="ml-3 text-sm text-gray-700">
                                  {config.isActive ? 'Actif' : 'Inactif'}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix de base (€)
                                  </label>
                                  <input
                                    type="number"
                                    value={config.basePrice}
                                    onChange={(e) => handlePricingChange(config.id, 'basePrice', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                    step="0.1"
                                    min="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={config.commissionRate}
                                    onChange={(e) => handlePricingChange(config.id, 'commissionRate', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marge (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={config.marginRate}
                                    onChange={(e) => handlePricingChange(config.id, 'marginRate', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix final (€)
                                  </label>
                                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
                                    €{calculateFinalPrice(config).toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix minimum (€)
                                  </label>
                                  <input
                                    type="number"
                                    value={config.minPrice}
                                    onChange={(e) => handlePricingChange(config.id, 'minPrice', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                    step="0.1"
                                    min="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix maximum (€)
                                  </label>
                                  <input
                                    type="number"
                                    value={config.maxPrice}
                                    onChange={(e) => handlePricingChange(config.id, 'maxPrice', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                    step="0.1"
                                    min="0"
                                  />
                                </div>
                              </div>

                              {/* Résumé des calculs */}
                              <div className="bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Résumé des calculs</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Commission</p>
                                    <p className="font-medium text-[#1E90FF]">€{calculateTotalCommission(config).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Marge</p>
                                    <p className="font-medium text-[#4CAF50]">€{calculateTotalMargin(config).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Total</p>
                                    <p className="font-medium text-gray-900">€{calculateFinalPrice(config).toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePricingTab === 'global' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Commission plateforme globale (%)
                            </label>
                            <input
                              type="number"
                              value={globalSettings.platformCommission}
                              onChange={(e) => handleGlobalSettingChange('platformCommission', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              step="0.1"
                              min="0"
                              max="100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Taux de récompense staking (%)
                            </label>
                            <input
                              type="number"
                              value={globalSettings.stakingRewardRate}
                              onChange={(e) => handleGlobalSettingChange('stakingRewardRate', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              step="0.1"
                              min="0"
                              max="10"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Durée de séquestre (jours)
                            </label>
                            <input
                              type="number"
                              value={globalSettings.sequesterDuration}
                              onChange={(e) => handleGlobalSettingChange('sequesterDuration', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              min="1"
                              max="30"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frais de retard (%)
                            </label>
                            <input
                              type="number"
                              value={globalSettings.latePaymentFee}
                              onChange={(e) => handleGlobalSettingChange('latePaymentFee', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              step="0.1"
                              min="0"
                              max="10"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Devise
                            </label>
                            <select
                              value={globalSettings.currency}
                              onChange={(e) => handleGlobalSettingChange('currency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                            >
                              <option value="EUR">EUR (Euro)</option>
                              <option value="USD">USD (Dollar US)</option>
                              <option value="XOF">XOF (Franc CFA)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Taux de taxe (%)
                            </label>
                            <input
                              type="number"
                              value={globalSettings.taxRate}
                              onChange={(e) => handleGlobalSettingChange('taxRate', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              step="0.1"
                              min="0"
                              max="25"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Résumé des paramètres globaux */}
                      <div className="bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Résumé des paramètres globaux</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Commission plateforme</p>
                            <p className="font-medium text-[#1E90FF]">{globalSettings.platformCommission}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Récompense staking</p>
                            <p className="font-medium text-purple-600">{globalSettings.stakingRewardRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Durée séquestre</p>
                            <p className="font-medium text-gray-900">{globalSettings.sequesterDuration} jours</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Frais de retard</p>
                            <p className="font-medium text-red-600">{globalSettings.latePaymentFee}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Devise</p>
                            <p className="font-medium text-gray-900">{globalSettings.currency}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Taxe</p>
                            <p className="font-medium text-gray-900">{globalSettings.taxRate}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePricingTab === 'calculator' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculateur de Prix Avancé</h3>
                        <p className="text-gray-600 mb-6">
                          Utilisez cet outil pour calculer le prix final d'un produit en fonction des paramètres configurés.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Prix de base (€)
                            </label>
                            <input
                              type="number"
                              placeholder="2.50"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                              step="0.1"
                              min="0"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Catégorie
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]">
                              <option value="">Sélectionner une catégorie</option>
                              <option value="vegetables">Légumes</option>
                              <option value="fruits">Fruits</option>
                              <option value="grains">Céréales</option>
                              <option value="livestock">Élevage</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Prix final calculé
                            </label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium">
                              €0.00
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Détail du calcul</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prix de base:</span>
                              <span className="font-medium">€0.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Commission ({globalSettings.platformCommission}%):</span>
                              <span className="font-medium text-[#1E90FF]">€0.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Marge:</span>
                              <span className="font-medium text-[#4CAF50]">€0.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taxe ({globalSettings.taxRate}%):</span>
                              <span className="font-medium text-orange-600">€0.00</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-gray-900 font-semibold">Total:</span>
                              <span className="font-bold text-gray-900">€0.00</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Règles de pricing dynamiques */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Règles de Pricing Dynamiques</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seuil de volume (kg)
                              </label>
                              <input
                                type="number"
                                placeholder="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                min="0"
                              />
                              <p className="text-xs text-gray-500 mt-1">Réduction automatique pour gros volumes</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Réduction volume (%)
                              </label>
                              <input
                                type="number"
                                placeholder="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                min="0"
                                max="50"
                              />
                              <p className="text-xs text-gray-500 mt-1">Pourcentage de réduction</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix saisonnier
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]">
                                <option value="normal">Normal</option>
                                <option value="high_season">Haute saison (+15%)</option>
                                <option value="low_season">Basse saison (-10%)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frais de livraison
                              </label>
                              <input
                                type="number"
                                placeholder="2.50"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                step="0.1"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historique des changements de prix */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des Changements de Prix</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Légumes - Commission</p>
                              <p className="text-xs text-gray-500">Modifié par Admin User</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">5.0% → 5.5%</p>
                              <p className="text-xs text-gray-500">15 Jan 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Fruits - Prix de base</p>
                              <p className="text-xs text-gray-500">Modifié par Admin User</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">€1.8 → €1.9</p>
                              <p className="text-xs text-gray-500">10 Jan 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Commission globale</p>
                              <p className="text-xs text-gray-500">Modifié par Admin User</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">5.0% → 5.2%</p>
                              <p className="text-xs text-gray-500">5 Jan 2024</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePricingTab === 'margins' && (
                    <div className="space-y-6">
                      {/* Configuration des marges par catégorie */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des Marges par Catégorie</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {pricingConfigs.map((config) => (
                            <div key={config.id} className="border border-gray-200 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">{config.category}</h4>
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500 mr-2">Marge actuelle:</span>
                                  <span className="text-lg font-bold text-[#4CAF50]">{config.marginRate}%</span>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marge recommandée (%)
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="range"
                                      min="0"
                                      max="50"
                                      value={config.marginRate}
                                      onChange={(e) => handlePricingChange(config.id, 'marginRate', parseFloat(e.target.value))}
                                      className="flex-1"
                                    />
                                    <span className="text-sm font-medium w-12">{config.marginRate}%</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Marge minimale (%)
                                    </label>
                                    <input
                                      type="number"
                                      value={Math.max(0, config.marginRate - 5)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                      min="0"
                                      max="50"
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Marge maximale (%)
                                    </label>
                                    <input
                                      type="number"
                                      value={Math.min(50, config.marginRate + 10)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                      min="0"
                                      max="50"
                                      readOnly
                                    />
                                  </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-2">Impact sur le prix</h5>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Prix de base:</span>
                                      <span className="font-medium">€{config.basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Marge ({config.marginRate}%):</span>
                                      <span className="font-medium text-[#4CAF50]">€{calculateTotalMargin(config).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                      <span className="text-gray-900 font-semibold">Prix avec marge:</span>
                                      <span className="font-bold text-gray-900">€{(config.basePrice + calculateTotalMargin(config)).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Analyse de rentabilité */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse de Rentabilité</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-green-800">Revenus Totaux</h4>
                              <BarChart3 className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              €{pricingConfigs.reduce((sum, config) => sum + calculateTotalMargin(config), 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-green-600">Marge totale par unité</p>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-800">Commission Moyenne</h4>
                              <Percent className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {(pricingConfigs.reduce((sum, config) => sum + config.commissionRate, 0) / pricingConfigs.length).toFixed(1)}%
                            </p>
                            <p className="text-sm text-blue-600">Taux moyen</p>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-purple-800">Marge Moyenne</h4>
                              <Calculator className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                              {(pricingConfigs.reduce((sum, config) => sum + config.marginRate, 0) / pricingConfigs.length).toFixed(1)}%
                            </p>
                            <p className="text-sm text-purple-600">Taux moyen</p>
                          </div>
                        </div>
                      </div>

                      {/* Recommandations de pricing */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommandations de Pricing</h3>
                        <div className="space-y-4">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                              <div>
                                <h4 className="font-semibold text-yellow-800">Optimisation suggérée</h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Considérez augmenter la marge des légumes de 15% à 18% pour améliorer la rentabilité.
                                  Cette augmentation pourrait générer +€0.06 par unité vendue.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                              <div>
                                <h4 className="font-semibold text-green-800">Configuration optimale</h4>
                                <p className="text-sm text-green-700 mt-1">
                                  Les marges actuelles pour les fruits et céréales sont bien positionnées par rapport au marché.
                                  Aucun ajustement recommandé.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <Settings className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                              <div>
                                <h4 className="font-semibold text-blue-800">Pricing dynamique</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                  Activez le pricing saisonnier pour l'élevage (+20% en haute saison) pour maximiser les revenus.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Contenu normal pour les autres sections */
                <div className="space-y-6">
                  {activeConfig.settings.map((setting) => (
                    <div key={setting.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-900 mb-1">
                            {setting.label}
                            {setting.required && <span className="text-red-500 ml-1">*</span>}
              </label>
                          <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
          </div>
        </div>

                      {setting.type === 'boolean' ? (
                        <div className="flex items-center">
                          <button
                            onClick={() => handleConfigChange(activeConfig.id, setting.id, !setting.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              setting.value ? 'bg-[#4CAF50]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                setting.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-700">
                            {setting.value ? 'Activé' : 'Désactivé'}
                          </span>
            </div>
                      ) : setting.type === 'select' ? (
                        <select
                          value={setting.value as string}
                          onChange={(e) => handleConfigChange(activeConfig.id, setting.id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all duration-200"
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                <input
                          type={setting.type === 'number' ? 'number' : 
                                setting.type === 'email' ? 'email' : 
                                setting.type === 'phone' ? 'tel' : 'text'}
                          value={setting.value as string | number}
                          onChange={(e) => handleConfigChange(activeConfig.id, setting.id, 
                            setting.type === 'number' ? Number(e.target.value) : e.target.value
                          )}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all duration-200"
                          placeholder={`Entrez ${setting.label.toLowerCase()}`}
                        />
                      )}
            </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleSaveConfiguration}
            disabled={isSaving}
            className="p-4 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="h-5 w-5 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder Configuration'}
          </button>
          <button 
            onClick={handleResetConfiguration}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
          <button 
            onClick={handleExportConfiguration}
            className="p-4 bg-gradient-to-r from-[#1E90FF] to-[#4CAF50] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Key className="h-5 w-5 mr-2" />
            Exporter Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametersConfig;