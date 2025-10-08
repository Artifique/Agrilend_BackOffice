import apiClient from "./api";
import { AxiosError } from "axios";

// --- TYPES DE DONNÉES POUR L'AUTHENTIFICATION ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  id: number; // userId from backend
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "FARMER" | "BUYER";
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "FARMER" | "BUYER";
  // Add other fields if they come with the user profile in the login response
}

// --- TYPES POUR L'API ---
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string; // Added timestamp as it's in the log
}

// --- FONCTIONS DU SERVICE ---

/**
 * Connecte un utilisateur et sauvegarde son token.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email et mot de passe sont requis");
  }

  try {
    console.log("Login request payload:", credentials);
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Login response:", response.data);

    const authData = response.data.data;

    // 🔥 Sauvegarde du token dans localStorage
    if (authData?.accessToken) {
      localStorage.setItem("authToken", authData.accessToken);
    }

    return authData;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const message = axiosError.response?.data?.message || axiosError.message || "Erreur inconnue";
    console.error("Login failed:", message);
    throw new Error(message);
  }
};

/**
 * Récupère le profil de l'utilisateur actuellement connecté.
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<ApiResponse<UserProfile>>("/user/profile");
    console.log("Profile response:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const message = axiosError.response?.data?.message || axiosError.message || "Erreur inconnue";
    console.error("Failed to fetch user profile:", message);
    throw new Error(message);
  }
};

/**
 * Inscrit un nouvel utilisateur.
 */
export const register = async (userData: Record<string, unknown>): Promise<AuthResponse> => {
  if (!userData.email || !userData.password) {
    throw new Error("Email et mot de passe sont requis pour l'inscription");
  }

  try {
    console.log("Register request payload:", userData);
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Register response:", response.data);

    const authData = response.data.data;

    // 🔥 Sauvegarde du token après inscription
    if (authData?.accessToken) {
      localStorage.setItem("authToken", authData.accessToken);
    }

    return authData;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const message = axiosError.response?.data?.message || axiosError.message || "Erreur inconnue";
    console.error("Registration failed:", message);
    throw new Error(message);
  }
};

/**
 * Déconnecte l'utilisateur et supprime le token.
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
    console.log("Logout successful");
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const message = axiosError.response?.data?.message || axiosError.message || "Erreur inconnue";
    console.error("Logout failed:", message);
  } finally {
    // 🔥 Supprime toujours le token local
    localStorage.removeItem("authToken");
  }
};
