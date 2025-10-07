import apiClient from "./api";
import { User, UserFormData } from "../components/UserForm"; // Assure-toi que le type User correspond bien à ton backend

// --- TYPES DE RÉPONSE ---
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface PaginatedUsers {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// --- FONCTIONS POUR ADMINISTRATEURS ---

/**
 * Récupère la liste de tous les utilisateurs (pour les admins).
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedUsers>>(
      "/admin/users"
    );
    console.log("Raw API users response:", response.data); // DEBUG
    return response.data.data.content; // ✅ bien extraire depuis data.data.content
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Récupère les détails d'un utilisateur spécifique (pour les admins).
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(
      `/admin/users/${userId}`
    );
    return response.data.data; // ✅ bien extraire depuis data.data
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Met à jour le profil d'un utilisateur par un administrateur.
 */
export const updateUser = async (userId: string, userData: any): Promise<User> => {
  const endpoint = `/admin/users/${userId}/profile`;
  
  try {
    const response = await apiClient.put<ApiResponse<User>>(endpoint, userData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating user ${userId} at endpoint ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Active un compte utilisateur (pour les admins).
 */
export const enableUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.post(`/admin/users/${userId}/enable`);
  } catch (error) {
    console.error(`Error enabling user ${userId}:`, error);
    throw error;
  }
};

/**
 * Désactive un compte utilisateur (pour les admins).
 */
export const disableUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.post(`/admin/users/${userId}/disable`);
  } catch (error) {
    console.error(`Error disabling user ${userId}:`, error);
    throw error;
  }
};

// --- FONCTIONS POUR L'UTILISATEUR CONNECTÉ ---

/**
 * Met à jour le profil de l'utilisateur connecté.
 */
export const updateMyProfile = async (
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      "/user/profile",
      userData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating own profile:", error);
    throw error;
  }
};

/**
 * Change le mot de passe de l'utilisateur connecté.
 */
export const changeMyPassword = async (
  passwordData: Record<string, unknown>
): Promise<void> => {
  try {
    await apiClient.post("/user/change-password", passwordData);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
