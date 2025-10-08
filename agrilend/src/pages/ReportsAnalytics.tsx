import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNotificationHelpers } from "../hooks/useNotificationHelpers";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getCategoryRevenue,
  DashboardStats,
  MonthlyRevenue,
  CategoryRevenue,
} from "../services/dashboardService";

const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenue[]>([]);
  const [categoryRevenueData, setCategoryRevenueData] = useState<CategoryRevenue[]>([]);
  const { showSuccess, showError } = useNotificationHelpers();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const stats = await getDashboardStats();
      setDashboardStats(stats);

      // Fetch monthly revenue for current year and month (example)
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // Month is 0-indexed
      const monthly = await getMonthlyRevenue(currentYear, currentMonth);
      console.log("Monthly revenue data from service:", monthly);
      setMonthlyRevenueData(monthly);

      const category = await getCategoryRevenue();
      setCategoryRevenueData(category);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showError("Erreur", "Impossible de charger les données du tableau de bord.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await fetchDashboardData();
    setIsGenerating(false);
    showSuccess("Succès", "Rapport généré avec succès !");
  };

  const handleExportData = async (format: string) => {
    if (format === 'csv') {
      const headers = ["Catégorie", "Revenus"];
      const rows = categoryRevenueData.map(item => `"${item.category}","${item.totalRevenue}"`);
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'revenus_par_categorie.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess("Succès", "Export CSV réussi !");
    } else if (format === 'pdf') {
      const input = document.getElementById('detailed-table');
      if (input) {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 200;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('rapport_revenus.pdf');
        showSuccess("Succès", "Export PDF réussi !");
      } else {
        showError("Erreur", "Tableau détaillé non trouvé pour l'export PDF.");
      }
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(categoryRevenueData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Revenus par Catégorie");
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, 'revenus_par_categorie.xlsx');
      showSuccess("Succès", "Export Excel réussi !");
    }
  };

  const totalRevenue = dashboardStats?.totalRevenueLast30Days || 0;
  const totalOrders = dashboardStats?.totalOrders || 0;
  const totalFarmers = dashboardStats?.totalActiveFarmers || 0;
  const totalBuyers = dashboardStats?.totalActiveBuyers || 0;

  const productDistributionForPieChart = useMemo(() => {
    return categoryRevenueData.map(item => ({
      category: item.category,
      value: item.totalRevenue, // Assuming value for pie chart is totalRevenue
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color for now
    }));
  }, [categoryRevenueData]);

  const revenueDataForAreaChart = useMemo(() => {
    // This needs to be adapted based on how monthlyRevenueData is structured
    // For now, let's assume it's a simple array of { month, totalRevenue }
    return monthlyRevenueData.map(item => ({
      month: `${item.month}/${item.year}`,
      revenue: item.totalRevenue,
      commission: item.totalRevenue * 0.05, // Example commission
      stakingRewards: item.totalRevenue * 0.02, // Example staking rewards
    }));
  }, [monthlyRevenueData]);

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
              disabled={isGenerating || isLoading}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center ${
                !isGenerating && !isLoading
                  ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              {isGenerating || isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
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
              {categoryRevenueData.map(cat => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
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
      {isLoading ? (
        <p>Chargement des métriques...</p>
      ) : dashboardStats ? (
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
      ) : (
        <p>Aucune donnée de métriques principales disponible.</p>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Revenus</h3>
          {isLoading ? (
            <p>Chargement des données de revenus...</p>
          ) : revenueDataForAreaChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueDataForAreaChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `€${(value as number).toLocaleString()}`, 
                    name === 'revenue' ? 'Revenus' : 
                    name === 'commission' ? 'Commissions' : 'Récompenses Staking'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                <Area type="monotone" dataKey="commission" stackId="2" stroke="#1E90FF" fill="#1E90FF" fillOpacity={0.6} />
                <Area type="monotone" dataKey="stakingRewards" stackId="3" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p>Aucune donnée de revenus mensuels disponible.</p>
          )}
        </div>

        {/* Répartition des produits */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Catégorie</h3>
          {isLoading ? (
            <p>Chargement des données de répartition...</p>
          ) : productDistributionForPieChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistributionForPieChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { category?: string; value?: number }) => {
                    const { category, value } = props;
                    const total = productDistributionForPieChart.reduce((sum, item) => sum + item.value, 0);
                    const percentage = ((value || 0) / total * 100).toFixed(0);
                    return `${category || 'Unknown'} ${percentage}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productDistributionForPieChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Aucune donnée de répartition par catégorie disponible.</p>
          )}
        </div>
      </div>

      {/* Graphique des commandes */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Commandes</h3>
        {isLoading ? (
          <p>Chargement des données de commandes...</p>
        ) : revenueDataForAreaChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueDataForAreaChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" fill="#1E90FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Aucune donnée d'évolution des commandes disponible.</p>
        )}
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenus</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {categoryRevenueData.length > 0 ? (
                categoryRevenueData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{data.category}</td>
                    <td className="py-3 px-4 text-[#4CAF50] font-medium">€{data.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{data.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-center text-gray-500">
                    Aucune donnée détaillée disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalytics;