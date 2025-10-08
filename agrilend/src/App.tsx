import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/NotificationProvider";
import { ConfirmationProvider } from "./components/ConfirmationProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import UsersManagement from "./pages/UsersManagement";
import OffersManagement from "./pages/OffersManagement";
import OrdersManagement from "./pages/OrdersManagement";
import FinancialManagement from "./pages/FinancialManagement";
import ProductManagement from "./pages/ProductManagement";
import DisputesManagement from "./pages/DisputesManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import ParametersConfig from "./pages/ParametersConfig";
import ErrorBoundary from "./components/ErrorBoundary";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="offers" element={<OffersManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="financial" element={<FinancialManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="disputes" element={<DisputesManagement />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="parameters" element={<ParametersConfig />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Route de fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ConfirmationProvider>
          <AppRoutes />
        </ConfirmationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
