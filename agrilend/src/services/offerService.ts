// services/offerService.ts
import apiClient from "./api";

export interface Offer {
  id: number;
  productId: number;
  availableQuantity: number;
  availabilityDate: string;
  suggestedUnitPrice: number;
  finalUnitPrice: number;
  status: "ACTIVE" | "PENDING_VALIDATION" | "REJECTED";
  notes: string;
  productName: string;
  productDescription: string;
  productUnit: string;
  productCategory: string;
  productionMethod?: string | null;
  farmerId: number;
  farmerName: string;
  farmerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfferPage {
  content: Offer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const getOffers = async (page = 0, size = 10): Promise<Offer[]> => {
  try {
    const response = await apiClient.get("/admin/offers", {
      params: { page, size },
    });

    // structure de ton JSON : data.content[]
    const d = response.data;
    if (d && d.data && Array.isArray(d.data.content)) {
      return d.data.content;
    }
    return [];
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};
