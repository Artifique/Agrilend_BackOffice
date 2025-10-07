import apiClient from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  unit: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Récupère la liste de tous les produits (paginée).
 */
export const getProducts = async (
  page = 0,
  size = 10
): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/admin/products", {
      params: { page, size },
    });

    const d = response.data;

    // ✅ correspond à la réponse JSON de ton backend
    if (d && d.data && d.data.content) {
      return d.data.content as Product[];
    }

    // fallback
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Récupère un produit par son ID.
 */
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/admin/products/${productId}`);
    const d = response.data;
    return d.data as Product; // ✅ ton backend envoie { success, data: {...} }
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * Crée un nouveau produit.
 */
export const createProduct = async (productData: { name: string; description: string; category: string; subcategory?: string; unit: string; }): Promise<Product> => {
  try {
    const now = new Date().toISOString();
    const fullProductData = {
      ...productData,
      imageUrl: productData.imageUrl || null, // Default to null if not provided
      createdAt: now,
      updatedAt: now,
      active: true, // Default to active
    };
    const response = await apiClient.post("/admin/products", fullProductData);
    return response.data.data as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Met à jour un produit existant.
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const response = await apiClient.put(
      `/admin/products/${productId}`,
      productData
    );
    return response.data.data as Product; // ✅
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Désactive un produit.
 */
export const deactivateProduct = async (productId: string): Promise<void> => {
  try {
    await apiClient.put(`/admin/products/${productId}/deactivate`);
  } catch (error) {
    console.error(`Error deactivating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Recherche des produits.
 */
export const searchProducts = async (
  keyword: string,
  page = 0,
  size = 10
): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/admin/products/search", {
      params: { keyword, page, size },
    });
    const d = response.data;
    return d.data?.content ?? []; // ✅
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
