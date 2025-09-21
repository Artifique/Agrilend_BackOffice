import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Download, Calendar, Filter, RefreshCw } from 'lucide-react';

interface ReportData {
  period: string;
  orders: number;
  revenue: number;
  farmers: number;
  buyers: number;
  transactions: number;
}

interface ProductDistribution {
  category: string;
  value: number;
  color: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  commission: number;
  stakingRewards: number;
}

const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Données des rapports
  const reportData: ReportData[] = [
    { period: 'Jan', orders: 45, revenue: 12500, farmers: 12, buyers: 8, transactions: 67 },
    { period: 'Fév', orders: 52, revenue: 14800, farmers: 15, buyers: 10, transactions: 78 },
    { period: 'Mar', orders: 38, revenue: 11200, farmers: 11, buyers: 7, transactions: 56 },
    { period: 'Avr', orders: 67, revenue: 18900, farmers: 18, buyers: 12, transactions: 89 },
    { period: 'Mai', orders: 73, revenue: 21500, farmers: 20, buyers: 15, transactions: 98 },
    { period: 'Juin', orders: 89, revenue: 26700, farmers: 24, buyers: 18, transactions: 112 }
  ];

  const productDistribution: ProductDistribution[] = [
    { category: 'Légumes', value: 35, color: '#4CAF50' },
    { category: 'Fruits', value: 28, color: '#FF9800' },
    { category: 'Céréales', value: 22, color: '#2196F3' },
    { category: 'Élevage', value: 15, color: '#9C27B0' }
  ];

  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 12500, commission: 625, stakingRewards: 250 },
    { month: 'Fév', revenue: 14800, commission: 740, stakingRewards: 296 },
    { month: 'Mar', revenue: 11200, commission: 560, stakingRewards: 224 },
    { month: 'Avr', revenue: 18900, commission: 945, stakingRewards: 378 },
    { month: 'Mai', revenue: 21500, commission: 1075, stakingRewards: 430 },
    { month: 'Juin', revenue: 26700, commission: 1335, stakingRewards: 534 }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    alert('Rapport généré avec succès !');
  };

  const handleExportData = (format: string) => {
    alert(`Export des données en format ${format.toUpperCase()} en cours...`);
  };

  const totalRevenue = reportData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = reportData.reduce((sum, data) => sum + data.orders, 0);
  const totalFarmers = Math.max(...reportData.map(data => data.farmers));
  const totalBuyers = Math.max(...reportData.map(data => data.buyers));

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rapports & Statistiques</h1>
            <p className="text-white/90 text-lg">Analysez les performances de votre plateforme AGRILEND</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                !isGenerating 
                  ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30' 
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Générer Rapport
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filtres et Période</h3>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
            >
              <option value="all">Toutes les catégories</option>
              <option value="vegetables">Légumes</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Céréales</option>
              <option value="livestock">Élevage</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Appliquer Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-[#4CAF50]">€{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+24% vs mois précédent</p>
            </div>
            <div className="p-3 bg-[#4CAF50]/10 rounded-xl">
              <DollarSign className="h-6 w-6 text-[#4CAF50]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-[#1E90FF]">{totalOrders}</p>
              <p className="text-sm text-blue-600">+18% vs mois précédent</p>
            </div>
            <div className="p-3 bg-[#1E90FF]/10 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-[#1E90FF]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agriculteurs Actifs</p>
              <p className="text-2xl font-bold text-orange-500">{totalFarmers}</p>
              <p className="text-sm text-orange-600">+12% vs mois précédent</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Acheteurs Actifs</p>
              <p className="text-2xl font-bold text-purple-500">{totalBuyers}</p>
              <p className="text-sm text-purple-600">+15% vs mois précédent</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `€${value.toLocaleString()}`, 
                  name === 'revenue' ? 'Revenus' : 
                  name === 'commission' ? 'Commissions' : 'Récompenses Staking'
                ]}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
              <Area type="monotone" dataKey="commission" stackId="2" stroke="#1E90FF" fill="#1E90FF" fillOpacity={0.6} />
              <Area type="monotone" dataKey="stakingRewards" stackId="3" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des produits */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: { name?: string; value?: string | number }) => {
                  const { name, value } = props;
                  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
                  const total = productDistribution.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((numericValue) / total * 100).toFixed(0);
                  return `${name || 'Unknown'} ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des commandes */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Commandes</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            <Bar dataKey="transactions" fill="#1E90FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Données Détaillées</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExportData('csv')}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-colors duration-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
            <button
              onClick={() => handleExportData('excel')}
              className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#1E90FF]/90 transition-colors duration-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </button>
            <button
              onClick={() => handleExportData('pdf')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Période</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Commandes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenus</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Agriculteurs</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acheteurs</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{data.period}</td>
                  <td className="py-3 px-4 text-[#1E90FF] font-medium">{data.orders}</td>
                  <td className="py-3 px-4 text-[#4CAF50] font-medium">€{data.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-orange-600 font-medium">{data.farmers}</td>
                  <td className="py-3 px-4 text-purple-600 font-medium">{data.buyers}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{data.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalytics;
