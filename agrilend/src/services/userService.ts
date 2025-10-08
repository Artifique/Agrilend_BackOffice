import apiClient from "./api";
import { User, UserFormData } from "../components/UserForm";

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

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  hederaAccountId?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  active: boolean; // Utilise 'active' au lieu de 'status'
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  companyName?: string;
  activityType?: string;
  companyAddress?: string;
}

// DTO pour la mise à jour/création d'utilisateur par l'admin
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optionnel car l'admin pourrait ne pas définir le mot de passe initialement
  phone?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  // Champs spécifiques au FARMER
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  // Champs spécifiques au BUYER
  companyName?: string;
  activityType?: string;
  companyAddress?: string;
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
export const getUserById = async (userId: number): Promise<User> => {
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
 * Enregistre un nouvel utilisateur (pour les admins ou via le formulaire d'inscription).
 */
export const registerUser = async (userData: SignupRequest): Promise<string> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(
      "/auth/register",
      userData
    );
    return response.data.message; // Retourne le message de succès
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Crée un nouvel utilisateur (pour les admins).
 */
export const createUser = async (userData: UserProfileDto): Promise<User> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      "/admin/users",
      userData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Met à jour le profil d'un utilisateur par un administrateur.
 */
export const updateUser = async (userId: number, userData: UserProfileDto): Promise<User> => {
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
export const activateUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.post(`/admin/users/${userId}/enable`, {}); // Ajout d'un corps de requête vide
  } catch (error) {
    console.error(`Error activating user ${userId}:`, error);
    throw error;
  }
};

export const deactivateUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.post(`/admin/users/${userId}/disable`, {}); // Ajout d'un corps de requête vide
  } catch (error) {
    console.error(`Error deactivating user ${userId}:`, error);
    throw error;
  }
};

// --- FONCTIONS POUR L'UTILISATEUR CONNECTÉ ---

/**
 * Met à jour le profil de l'utilisateur connecté.
 */
export const updateMyProfile = async (
  userData: Partial<UserProfileDto>
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
