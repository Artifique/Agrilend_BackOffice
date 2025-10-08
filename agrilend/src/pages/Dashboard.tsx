import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ShoppingCart, DollarSign, Activity, Calendar, Eye, Truck,
  TrendingUp, TrendingDown, AlertTriangle, Clock, Zap, Shield,
  PieChart as PieChartIcon, RefreshCw, Download
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Bar, Line
} from 'recharts';
import { getDashboardStats, DashboardStats } from '../services/statisticsService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données dynamiques avec état
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalOffers: 0,
    pendingOffers: 0,
    totalOrders: 0,
    ordersInEscrow: 0,
    totalRevenue: 0,
    totalTokensMinted: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStats();
      setDashboardData(stats);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Données pour le graphique des commandes avec plus de détails
  const chartData = [
    { mois: 'Jan', commandes: 45, livrees: 38, revenus: 12500, sequestres: 8, annulees: 2 },
    { mois: 'Fév', commandes: 52, livrees: 48, revenus: 15200, sequestres: 3, annulees: 1 },
    { mois: 'Mar', commandes: 38, livrees: 35, revenus: 11800, sequestres: 2, annulees: 1 },
    { mois: 'Avr', commandes: 61, livrees: 55, revenus: 18900, sequestres: 5, annulees: 1 },
    { mois: 'Mai', commandes: 47, livrees: 42, revenus: 14200, sequestres: 4, annulees: 1 },
    { mois: 'Jun', commandes: 55, livrees: 50, revenus: 16800, sequestres: 4, annulees: 1 },
    { mois: 'Jul', commandes: 43, livrees: 40, revenus: 13200, sequestres: 2, annulees: 1 },
    { mois: 'Aoû', commandes: 39, livrees: 36, revenus: 12100, sequestres: 2, annulees: 1 },
    { mois: 'Sep', commandes: 58, livrees: 52, revenus: 17500, sequestres: 5, annulees: 1 },
    { mois: 'Oct', commandes: 49, livrees: 45, revenus: 14800, sequestres: 3, annulees: 1 },
    { mois: 'Nov', commandes: 53, livrees: 48, revenus: 16200, sequestres: 4, annulees: 1 },
    { mois: 'Déc', commandes: 67, livrees: 60, revenus: 20100, sequestres: 6, annulees: 1 }
  ];

  // Données pour le graphique en secteurs (répartition des produits)
  const productData = [
    { name: 'Légumes', value: 35, color: '#4CAF50', amount: 12500 },
    { name: 'Fruits', value: 25, color: '#FF9800', amount: 8900 },
    { name: 'Céréales', value: 20, color: '#2196F3', amount: 7200 },
    { name: 'Élevage', value: 15, color: '#9C27B0', amount: 5400 },
    { name: 'Autres', value: 5, color: '#607D8B', amount: 1800 }
  ];

  // Données pour le graphique de performance blockchain
  const blockchainData = [
    { jour: 'Lun', transactions: 45, sequestres: 8, staking: 12, latence: 2.1 },
    { jour: 'Mar', transactions: 52, sequestres: 10, staking: 15, latence: 1.8 },
    { jour: 'Mer', transactions: 38, sequestres: 6, staking: 9, latence: 2.3 },
    { jour: 'Jeu', transactions: 61, sequestres: 12, staking: 18, latence: 1.9 },
    { jour: 'Ven', transactions: 47, sequestres: 9, staking: 14, latence: 2.0 },
    { jour: 'Sam', transactions: 33, sequestres: 5, staking: 8, latence: 2.2 },
    { jour: 'Dim', transactions: 28, sequestres: 4, staking: 6, latence: 2.4 }
  ];

  // Données pour les alertes et notifications
  const alerts = [
    { id: 1, type: 'warning', message: '3 commandes en retard de livraison', time: '2h', icon: AlertTriangle },
    { id: 2, type: 'info', message: 'Nouvelle transaction Hedera détectée', time: '4h', icon: Zap },
    { id: 3, type: 'success', message: 'Staking activé avec succès', time: '6h', icon: Shield },
    { id: 4, type: 'warning', message: 'Fonds séquestrés en attente', time: '8h', icon: Clock },
    { id: 5, type: 'critical', message: 'Temps de réponse API > 2s détecté', time: '1h', icon: Activity },
    { id: 6, type: 'info', message: 'Performance système optimale', time: '3h', icon: TrendingUp }
  ];

  // Données de performance système
  const performanceData = [
    { time: '00:00', apiResponse: 1.2, hederaLatency: 0.8, cpuUsage: 45, memoryUsage: 60 },
    { time: '04:00', apiResponse: 1.1, hederaLatency: 0.7, cpuUsage: 42, memoryUsage: 58 },
    { time: '08:00', apiResponse: 1.8, hederaLatency: 1.2, cpuUsage: 65, memoryUsage: 72 },
    { time: '12:00', apiResponse: 2.1, hederaLatency: 1.5, cpuUsage: 78, memoryUsage: 85 },
    { time: '16:00', apiResponse: 1.9, hederaLatency: 1.3, cpuUsage: 70, memoryUsage: 80 },
    { time: '20:00', apiResponse: 1.5, hederaLatency: 1.0, cpuUsage: 55, memoryUsage: 68 }
  ];

  // Fonctions utilitaires
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Fonction de rafraîchissement des données - optimisée
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  // Fonction d'export des données
  const handleExportData = () => {
    const data = {
      dashboard: dashboardData,
      charts: { chartData, productData, blockchainData },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `agrilend-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Fonctions pour les actions rapides - optimisées pour les performances
  const handleNewUser = useCallback(() => {
    navigate('/users');
    // Utilisation de requestAnimationFrame pour éviter les reflows
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const addButton = document.querySelector('[data-action="add-user"]');
        if (addButton) {
          addButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            (addButton as HTMLElement).click();
          }, 100);
        }
      });
    });
  }, [navigate]);

  const handleNewOrder = useCallback(() => {
    navigate('/orders');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const addButton = document.querySelector('[data-action="add-order"]');
        if (addButton) {
          addButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            (addButton as HTMLElement).click();
          }, 100);
        }
      });
    });
  }, [navigate]);

  const handleNewDelivery = useCallback(() => {
    navigate('/logistics');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const addButton = document.querySelector('[data-action="add-delivery"]');
        if (addButton) {
          addButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            (addButton as HTMLElement).click();
          }, 100);
        }
      });
    });
  }, [navigate]);

  const handleViewAllActivities = () => {
    navigate('/orders');
  };

  // Effet pour le rafraîchissement automatique - optimisé
  useEffect(() => {
    // Utilisation d'un délai plus long pour réduire la charge
    const interval = setInterval(() => {
      // Vérifier si la page est visible avant de rafraîchir
      if (!document.hidden) {
        handleRefresh();
      }
    }, 600000); // 10 minutes au lieu de 5

    return () => clearInterval(interval);
  }, [handleRefresh]);

  return (
    <div className="space-y-8">
      {/* Header avec gradient et contrôles */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        {/* Effet de fond animé */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
      <div>
            <h1 className="text-4xl font-bold mb-2">Tableau de bord AGRILEND</h1>
            <p className="text-white/90 text-lg">Vue d'ensemble de votre plateforme agricole blockchain</p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center text-white/80">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center text-white/80">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{new Date().toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Sélecteur de période */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="week" className="text-gray-900">Cette semaine</option>
              <option value="month" className="text-gray-900">Ce mois</option>
              <option value="quarter" className="text-gray-900">Ce trimestre</option>
              <option value="year" className="text-gray-900">Cette année</option>
            </select>
            
            {/* Bouton de rafraîchissement */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 hover:bg-white/30 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Bouton d'export */}
            <button
              onClick={handleExportData}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 hover:bg-white/30 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards avec design moderne et données dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Utilisateurs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#1E90FF] to-[#4CAF50] rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Totaux</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(dashboardData.totalUsers)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatNumber(dashboardData.totalFarmers)} Agriculteurs, {formatNumber(dashboardData.totalBuyers)} Acheteurs</p>
          </div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#1E90FF] to-[#4CAF50] rounded-full transition-all duration-1000"
              style={{ width: `${(dashboardData.totalFarmers / dashboardData.totalUsers) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Commandes Totales</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">{dashboardData.pendingOffers} en attente, {dashboardData.ordersInEscrow} séquestrées</p>
          </div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-full transition-all duration-1000"
              style={{ width: `${((dashboardData.totalOrders - dashboardData.pendingOffers - dashboardData.ordersInEscrow) / dashboardData.totalOrders) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Transactions blockchain */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-white" />
            </div>
                </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Tokens Mintés</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(dashboardData.totalTokensMinted)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(dashboardData.ordersInEscrow)} séquestrés</p>
          </div>
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Réseau stable</span>
                </div>
              </div>

        {/* Revenus plateforme */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Revenus plateforme</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Total des revenus générés</p>
          </div>
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <span>Croissance constante</span>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Alertes & Notifications</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">{alerts.length} alertes actives</span>
          </div>
                    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            const getAlertColor = (type: string) => {
              switch (type) {
                case 'warning': return 'bg-orange-50 border-orange-200 text-orange-800';
                case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
                case 'success': return 'bg-green-50 border-green-200 text-green-800';
                default: return 'bg-gray-50 border-gray-200 text-gray-800';
              }
            };
            return (
              <div key={alert.id} className={`p-4 rounded-xl border ${getAlertColor(alert.type)} hover:shadow-md transition-all duration-300`}>
                <div className="flex items-start">
                  <Icon className="h-5 w-5 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">Il y a {alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
                  </div>
                </div>

      {/* Graphiques et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des commandes avancé */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance des Commandes</h3>
              <p className="text-sm text-gray-600">Évolution mensuelle des commandes et revenus</p>
            </div>
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
                <span className="text-sm text-gray-600">Commandes</span>
              </div>
              <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#1E90FF] rounded-full"></div>
                <span className="text-sm text-gray-600">Livrées</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Séquestres</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mois" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    const labels: { [key: string]: string } = {
                      'commandes': 'Commandes',
                      'livrees': 'Livrées',
                      'sequestres': 'Séquestres',
                      'revenus': 'Revenus'
                    };
                    return [name === 'revenus' ? formatCurrency(Number(value)) : value, labels[name as string] || name];
                  }}
                  labelFormatter={(label) => `Mois: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => {
                    const labels: { [key: string]: string } = {
                      'commandes': 'Commandes',
                      'livrees': 'Livrées',
                      'sequestres': 'Séquestres',
                      'revenus': 'Revenus'
                    };
                    return labels[value] || value;
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="commandes" 
                  fill="#4CAF50" 
                  name="commandes"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="livrees" 
                  fill="#1E90FF" 
                  name="livrees"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="sequestres" 
                  fill="#9C27B0" 
                  name="sequestres"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#FF9800" 
                  strokeWidth={3}
                  name="revenus"
                  dot={{ fill: '#FF9800', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des produits améliorée */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Répartition des produits</h3>
              <p className="text-sm text-gray-600">Ventes par catégorie</p>
            </div>
            <PieChartIcon className="h-5 w-5 text-[#4CAF50]" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    name,
                    `Montant: ${formatCurrency(props.payload.amount)}`
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {productData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques de Performance */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Métriques de Performance</h3>
            <p className="text-sm text-gray-600">Monitoring des temps de réponse et performance système</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Système opérationnel</span>
          </div>
        </div>
        
        {/* Cartes de métriques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Temps de réponse API</p>
                <p className="text-2xl font-bold text-green-700">1.2s</p>
                <p className="text-xs text-green-600">Moyenne 24h</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Latence Hedera</p>
                <p className="text-2xl font-bold text-blue-700">0.8s</p>
                <p className="text-xs text-blue-600">Transaction moyenne</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Uptime</p>
                <p className="text-2xl font-bold text-purple-700">99.9%</p>
                <p className="text-xs text-purple-600">30 derniers jours</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Requêtes/min</p>
                <p className="text-2xl font-bold text-orange-700">1,247</p>
                <p className="text-xs text-orange-600">Charge actuelle</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphique de performance en temps réel */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={blockchainData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="jour" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const labels: { [key: string]: string } = {
                    'transactions': 'Transactions',
                    'sequestres': 'Séquestres',
                    'staking': 'Staking',
                    'latence': 'Latence (ms)'
                  };
                  return [value, labels[name as string] || name];
                }}
                labelFormatter={(label) => `Jour: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: { [key: string]: string } = {
                    'transactions': 'Transactions',
                    'sequestres': 'Séquestres',
                    'staking': 'Staking',
                    'latence': 'Latence'
                  };
                  return labels[value] || value;
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="transactions" 
                stackId="1"
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.6}
                name="transactions"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="sequestres" 
                stackId="2"
                stroke="#1E90FF" 
                fill="#1E90FF" 
                fillOpacity={0.6}
                name="sequestres"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="staking" 
                stackId="3"
                stroke="#9C27B0" 
                fill="#9C27B0" 
                fillOpacity={0.6}
                name="staking"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="latence" 
                stroke="#FF5722" 
                strokeWidth={2}
                name="latence"
                dot={{ fill: '#FF5722', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Blockchain */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Performance Blockchain Hedera</h3>
            <p className="text-sm text-gray-600">Métriques hebdomadaires du réseau</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Réseau opérationnel</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={blockchainData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="jour" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const labels: { [key: string]: string } = {
                    'transactions': 'Transactions',
                    'sequestres': 'Séquestres',
                    'staking': 'Staking',
                    'latence': 'Latence (ms)'
                  };
                  return [value, labels[name as string] || name];
                }}
                labelFormatter={(label) => `Jour: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: { [key: string]: string } = {
                    'transactions': 'Transactions',
                    'sequestres': 'Séquestres',
                    'staking': 'Staking',
                    'latence': 'Latence'
                  };
                  return labels[value] || value;
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="transactions" 
                stackId="1"
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.6}
                name="transactions"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="sequestres" 
                stackId="2"
                stroke="#1E90FF" 
                fill="#1E90FF" 
                fillOpacity={0.6}
                name="sequestres"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="staking" 
                stackId="3"
                stroke="#9C27B0" 
                fill="#9C27B0" 
                fillOpacity={0.6}
                name="staking"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="latence" 
                stroke="#FF5722" 
                strokeWidth={2}
                name="latence"
                dot={{ fill: '#FF5722', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monitoring Système Avancé */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Monitoring Système Avancé</h3>
            <p className="text-sm text-gray-600">Surveillance en temps réel des performances</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Temps réel</span>
            </div>
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              <RefreshCw className="h-3 w-3 mr-1 inline" />
              Actualiser
            </button>
          </div>
        </div>
        
        {/* Métriques système détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Ressources Système</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Disk Usage</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Network I/O</span>
                  <span className="font-medium">1.2 MB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Performance API</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">GET /api/users</p>
                  <p className="text-xs text-gray-500">Moyenne: 1.2s</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">✓ OK</p>
                  <p className="text-xs text-gray-500">99.9% uptime</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">POST /api/transactions</p>
                  <p className="text-xs text-gray-500">Moyenne: 0.8s</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">✓ OK</p>
                  <p className="text-xs text-gray-500">99.8% uptime</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">GET /api/hedera/status</p>
                  <p className="text-xs text-gray-500">Moyenne: 0.5s</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">✓ OK</p>
                  <p className="text-xs text-gray-500">100% uptime</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">POST /api/kyc/validate</p>
                  <p className="text-xs text-gray-500">Moyenne: 2.1s</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">⚠ Slow</p>
                  <p className="text-xs text-gray-500">98.5% uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphique de performance en temps réel */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const labels: { [key: string]: string } = {
                    'apiResponse': 'Temps API (s)',
                    'hederaLatency': 'Latence Hedera (s)',
                    'cpuUsage': 'CPU (%)',
                    'memoryUsage': 'Mémoire (%)'
                  };
                  return [value, labels[name as string] || name];
                }}
                labelFormatter={(label) => `Heure: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: { [key: string]: string } = {
                    'apiResponse': 'Temps API',
                    'hederaLatency': 'Latence Hedera',
                    'cpuUsage': 'CPU',
                    'memoryUsage': 'Mémoire'
                  };
                  return labels[value] || value;
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="apiResponse" 
                stroke="#4CAF50" 
                strokeWidth={3}
                name="apiResponse"
                dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="hederaLatency" 
                stroke="#1E90FF" 
                strokeWidth={3}
                name="hederaLatency"
                dot={{ fill: '#1E90FF', strokeWidth: 2, r: 4 }}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="cpuUsage" 
                stroke="#FF9800" 
                fill="#FF9800" 
                fillOpacity={0.3}
                name="cpuUsage"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="memoryUsage" 
                stroke="#9C27B0" 
                fill="#9C27B0" 
                fillOpacity={0.3}
                name="memoryUsage"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activités récentes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Activités récentes</h3>
            <Activity className="h-5 w-5 text-[#4CAF50]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-xl">
              <div className="w-2 h-2 bg-[#4CAF50] rounded-full mr-3"></div>
              <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nouvelle commande créée</p>
              <p className="text-xs text-gray-500">Tomates - Jean Kouassi - Il y a 2h</p>
            </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-[#1E90FF]/5 to-[#4CAF50]/5 rounded-xl">
              <div className="w-2 h-2 bg-[#1E90FF] rounded-full mr-3"></div>
              <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Transaction séquestrée</p>
              <p className="text-xs text-gray-500">€125 - Hedera Hashgraph - Il y a 4h</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Staking activé</p>
              <p className="text-xs text-gray-500">€125 - Récompense: €2.50 - Il y a 6h</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Livraison en cours</p>
              <p className="text-xs text-gray-500">Tomates - Mohamed Traoré - Il y a 8h</p>
            </div>
            </div>
          </div>
          <button 
            onClick={handleViewAllActivities}
            className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir toutes les activités
          </button>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleNewUser}
            className="p-4 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Users className="h-5 w-5 mr-2" />
            Nouvel utilisateur
          </button>
          <button 
            onClick={handleNewOrder}
            className="p-4 bg-gradient-to-r from-[#1E90FF] to-[#4CAF50] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Nouvelle commande
          </button>
          <button 
            onClick={handleNewDelivery}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Truck className="h-5 w-5 mr-2" />
            Nouvelle livraison
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;