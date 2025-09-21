import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialiser l'état à partir du localStorage
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  useEffect(() => {
    // Mettre à jour le localStorage chaque fois que isAuthenticated change
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => {
    console.log('Login function called - setting isAuthenticated to true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout function called - setting isAuthenticated to false');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
