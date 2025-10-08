import apiClient from "./api";

// Assuming a generic API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// For paginated responses (e.g., Get all products)
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// For 6.1. Créer un nouveau produit (Request JSON)
export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  unit: string;
  imageUrl?: string;
}

export interface ProductUpdateData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  unit: string;
  imageUrl?: string | null;
  active: boolean; // Pour la mise à jour du statut
}

// For 6.1. Créer un nouveau produit (Response JSON) and 6.4. Obtenir un produit par ID
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  unit: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean; // Assuming there might be an 'active' status for products, similar to users
}

const BASE_URL = "/admin/products";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(BASE_URL);
  return response.data.data.content;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(`${BASE_URL}/${id}`);
  return response.data.data;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await apiClient.post<ApiResponse<Product>>(BASE_URL, productData);
  return response.data.data;
};

export const updateProduct = async (id: number, productData: ProductUpdateData): Promise<Product> => {
  const response = await apiClient.put<ApiResponse<Product>>(`${BASE_URL}/${id}`, productData);
  return response.data.data;
};

export const deactivateProduct = async (id: number): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(`${BASE_URL}/${id}/deactivate`, {});
};

export const activateProduct = async (id: number): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(`${BASE_URL}/${id}/activate`, {});
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(`${BASE_URL}/search`, {
    params: { query },
  });
  return response.data.data.content;
};