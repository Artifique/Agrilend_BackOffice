import React from "react";
import FormField from "./FormField";

// Farmer profile
export interface FarmerProfile {
  farmName: string;
  farmLocation: string;
  farmSizeHectares?: number;
  certifications?: string; // JSON string
  bankAccountDetails?: string; // Encrypted in production
  farmingSince?: number; // YEAR
  specializations?: string; // JSON string
}

// Buyer profile
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

// User form data
export type UserFormData = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  hederaAccountId?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
};

// User type
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  hederaAccountId?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  createdAt: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
  ordersCount: number;
  totalAmount: number;
}

// Valeur initiale pour formulaire
export const initialUserForm: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  hederaAccountId: "",
  role: "BUYER",
  status: "PENDING",
  farmerProfile: { farmName: "", farmLocation: "" },
  buyerProfile: { companyName: "" },
};

// Composant UserForm
const UserForm: React.FC<{
  user: UserFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onProfileChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    profileType: "farmerProfile" | "buyerProfile"
  ) => void;
  isNewUser?: boolean;
}> = ({ user, onChange, onProfileChange, isNewUser }) => (
  <>
    <FormField
      label="Prénom"
      name="firstName"
      type="text"
      value={user.firstName}
      onChange={onChange}
      placeholder="Jean"
      required
    />
    <FormField
      label="Nom"
      name="lastName"
      type="text"
      value={user.lastName}
      onChange={onChange}
      placeholder="Kouassi"
      required
    />
    <FormField
      label="Email"
      name="email"
      type="email"
      value={user.email}
      onChange={onChange}
      placeholder="jean.kouassi@email.com"
      required
    />
    {isNewUser && (
      <FormField
        label="Mot de passe"
        name="password"
        type="password"
        value={user.password || ""}
        onChange={onChange}
        placeholder="********"
        required
      />
    )}
    <FormField
      label="Téléphone"
      name="phone"
      type="tel"
      value={user.phone || ""}
      onChange={onChange}
      placeholder="+225 07 12 34 56"
    />
    <FormField
      label="ID Compte Hedera"
      name="hederaAccountId"
      type="text"
      value={user.hederaAccountId || ""}
      onChange={onChange}
      placeholder="0.0.123456"
    />
    <FormField
      label="Rôle"
      name="role"
      type="select"
      value={user.role}
      onChange={onChange}
      required
      options={[
        { value: "FARMER", label: "Agriculteur" },
        { value: "BUYER", label: "Acheteur" },
        { value: "ADMIN", label: "Administrateur" },
      ]}
    />
    <FormField
      label="Statut"
      name="status"
      type="select"
      value={user.status}
      onChange={onChange}
      required
      options={[
        { value: "ACTIVE", label: "Actif" },
        { value: "PENDING", label: "En attente" },
        { value: "INACTIVE", label: "Inactif" },
      ]}
    />

    {user.role === "FARMER" && user.farmerProfile && (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3">Profil Agriculteur</h3>
        <FormField
          label="Nom de la ferme"
          name="farmName"
          type="text"
          value={user.farmerProfile.farmName}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder="Ferme du Bonheur"
          required
        />
        <FormField
          label="Localisation de la ferme"
          name="farmLocation"
          type="text"
          value={user.farmerProfile.farmLocation}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder="Yamoussoukro, Côte d'Ivoire"
          required
        />
        <FormField
          label="Taille de la ferme (hectares)"
          name="farmSizeHectares"
          type="number"
          value={user.farmerProfile.farmSizeHectares || ""}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder="100"
        />
        <FormField
          label="Certifications (JSON)"
          name="certifications"
          type="textarea"
          value={user.farmerProfile.certifications || ""}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder='["Bio", "GlobalGAP"]'
        />
        <FormField
          label="Détails du compte bancaire"
          name="bankAccountDetails"
          type="textarea"
          value={user.farmerProfile.bankAccountDetails || ""}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder="RIB, IBAN, SWIFT"
        />
        <FormField
          label="Année de début d'activité"
          name="farmingSince"
          type="number"
          value={user.farmerProfile.farmingSince || ""}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder="2000"
        />
        <FormField
          label="Spécialisations (JSON)"
          name="specializations"
          type="textarea"
          value={user.farmerProfile.specializations || ""}
          onChange={(e) => onProfileChange(e, "farmerProfile")}
          placeholder='["Céréales", "Légumes"]'
        />
      </>
    )}

    {user.role === "BUYER" && user.buyerProfile && (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3">Profil Acheteur</h3>
        <FormField
          label="Nom de l'entreprise"
          name="companyName"
          type="text"
          value={user.buyerProfile.companyName || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="Agro Distribution SARL"
          required
        />
        <FormField
          label="Type d'entreprise"
          name="businessType"
          type="text"
          value={user.buyerProfile.businessType || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="SARL, SA, EURL"
        />
        <FormField
          label="Numéro d'enregistrement commercial"
          name="businessRegistrationNumber"
          type="text"
          value={user.buyerProfile.businessRegistrationNumber || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="RC 1234567"
        />
        <FormField
          label="Numéro de TVA"
          name="vatNumber"
          type="text"
          value={user.buyerProfile.vatNumber || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="FRXX123456789"
        />
        <FormField
          label="Adresse de facturation"
          name="billingAddress"
          type="textarea"
          value={user.buyerProfile.billingAddress || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="123 Rue de la Facturation, Ville"
        />
        <FormField
          label="Adresse de livraison"
          name="shippingAddress"
          type="textarea"
          value={user.buyerProfile.shippingAddress || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="456 Avenue de la Livraison, Ville"
        />
        <FormField
          label="Limite de crédit"
          name="creditLimit"
          type="number"
          value={user.buyerProfile.creditLimit || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="10000.00"
        />
        <FormField
          label="Jours de conditions de paiement"
          name="paymentTermsDays"
          type="number"
          value={user.buyerProfile.paymentTermsDays || ""}
          onChange={(e) => onProfileChange(e, "buyerProfile")}
          placeholder="30"
        />
      </>
    )}
  </>
);

export default UserForm;
