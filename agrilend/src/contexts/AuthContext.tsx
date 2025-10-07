import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  login as apiLogin,
  getMyProfile,
  LoginCredentials,
  UserProfile,
} from "../services/authService";

// Interface pour la valeur du contexte d'authentification
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Création du contexte avec une valeur par défaut
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Props pour le fournisseur d'authentification
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Vérifier la session au chargement de l'application
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const userProfile = await getMyProfile();
          setUser(userProfile);
        } catch (error) {
          console.error("Session verification failed:", error);
          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, [token]);

  // Fonction de connexion
  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    console.log("Login response from backend:", response);

    const newToken = response.accessToken;
    const userProfile: UserProfile = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };

    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setUser(userProfile);
    console.log("Auth context updated:", { newToken, userProfile });
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  }, []);

  // Mémoriser la valeur du contexte pour éviter les rendus inutiles
  const value = useMemo(
    () => ({
      isAuthenticated: !!token && !!user,
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};