// Farmer-specific profile data
export interface FarmerProfile {
  farmName: string;
  farmLocation: string;
  farmSizeHectares?: number;
  certifications?: string; // JSON string
  bankAccountDetails?: string; // Encrypted in production
  farmingSince?: number; // YEAR
  specializations?: string; // JSON string
}

// Buyer-specific profile data
export interface BuyerProfile {
  companyName?: string;
  businessType?: string;
  businessRegistrationNumber?: string;
  vatNumber?: string;
  billingAddress?: string;
  shippingAddress?: string;
  creditLimit?: number;
  paymentTermsDays?: number;
}

// Base User data for forms
export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Added for new user creation
  phone?: string;
  address?: string; // Corresponds to users.address
  hederaAccountId?: string; // Optional, corresponds to users.hedera_account_id
  role: 'FARMER' | 'BUYER' | 'ADMIN'; // Uppercase to match SQL ENUM
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'; // Uppercase to match SQL ENUM (derived from is_active and email_verified)

  // Role-specific form data (optional)
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
};

// Objet de réinitialisation du formulaire
export const initialUserForm: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  hederaAccountId: '',
  role: 'FARMER',
  status: 'PENDING',
  farmerProfile: {
    farmName: '',
    farmLocation: '',
  },
  buyerProfile: {
    companyName: '',
  }
};

// Full User interface for display and data handling, including optional role-specific profiles
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  hederaAccountId?: string;
  role: 'FARMER' | 'BUYER' | 'ADMIN';
  createdAt: string; // Corresponds to users.created_at (joinDate)
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'; // Derived status
  isActive: boolean; // Corresponds to users.is_active
  emailVerified: boolean; // Corresponds to users.email_verified
  lastLogin?: string; // Corresponds to users.last_login

  // Role-specific profiles (optional)
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;

  // Aggregate data (not directly from SQL user table, but derived)
  ordersCount: number;
  totalAmount: number;
}
