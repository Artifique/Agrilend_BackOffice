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

// DTO pour la mise à jour/création d'utilisateur par l'admin
export interface UserProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  hederaAccountId?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  farmerProfile?: { farmName: string; farmLocation: string }; // Simplified for DTO
  buyerProfile?: { companyName: string }; // Simplified for DTO
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
  const endpoint = `/admin/users/${userId}`;
  
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
    await apiClient.put(`/admin/users/${userId}/activate`);
  } catch (error) {
    console.error(`Error activating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Désactive un compte utilisateur (pour les admins).
 */
export const deactivateUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.put(`/admin/users/${userId}/deactivate`);
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
