import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulation d'authentification
    setTimeout(() => {
      login();
      setIsLoading(false);
      
      // Rediriger vers la page d'origine ou le dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/assets/bg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img 
              src="/assets/logo-aagri.png" 
              alt="Agrilent Logo" 
              className="max-w-[75%] h-auto mx-auto object-contain mb-4"
            />
            {/* Debug info */}
            <div className="text-xs text-gray-500 mb-2">
              Debug: isAuthenticated = {isAuthenticated ? 'true' : 'false'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-[#1E90FF] hover:text-[#4CAF50] transition-colors font-medium">
                Mot de passe oublié?
              </a>
            </div>

            {/* Bouton de connexion - Structure complètement statique */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] hover:from-[#1E90FF] hover:to-[#4CAF50] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                <span>Se connecter</span>
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              En vous connectant, vous acceptez nos{' '}
              <a href="#" className="text-[#1E90FF] hover:text-[#4CAF50] transition-colors">
                conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-[#1E90FF] hover:text-[#4CAF50] transition-colors">
                politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;