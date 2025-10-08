// services/offerService.ts
import apiClient from "./api";

export interface Offer {
  id: number;
  productId: number;
  availableQuantity: number;
  availabilityDate: string;
  suggestedUnitPrice: number;
  finalUnitPrice: number;
  status: "DRAFT" | "PENDING_VALIDATION" | "ACTIVE" | "SOLD_OUT" | "EXPIRED" | "REJECTED";
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

export const getOffers = async (
  page = 0,
  size = 10
): Promise<OfferPage> => {
  try {
    const response = await apiClient.get("/admin/offers", {
      params: { page, size },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const approveOffer = async (offerId: number): Promise<void> => {
  try {
    await apiClient.post(`/admin/offers/${offerId}/approve`);
  } catch (error) {
    console.error(`Error approving offer ${offerId}:`, error);
    throw error;
  }
};

export const rejectOffer = async (offerId: number, reason: string): Promise<void> => {
  try {
    await apiClient.post(`/admin/offers/${offerId}/reject`, null, {
      params: { reason },
    });
  } catch (error) {
    console.error(`Error rejecting offer ${offerId}:`, error);
    throw error;
  }
};
