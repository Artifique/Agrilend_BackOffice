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
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hederaAccountId?: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  createdAt: string;
  updatedAt?: string; // Ajouté
  active: boolean; // Correspond à 'active' du JSON
  // Champs spécifiques aux profils, directement sur l'objet User
  farmName?: string;
  farmLocation?: string;
  farmSize?: string; // Le JSON montre '30 hectares' qui est une chaîne
  companyName?: string;
  activityType?: string;
  companyAddress?: string;
  // Champs qui étaient dans l'ancienne interface mais pas dans le JSON fourni, rendus optionnels
  address?: string;
  status?: "ACTIVE" | "PENDING" | "INACTIVE"; // Gardé pour la compatibilité, mais peut être déduit de 'active'
  isActive?: boolean; // Gardé pour la compatibilité, mais 'active' est la source
  emailVerified?: boolean;
  lastLogin?: string;
  ordersCount?: number;
  totalAmount?: number;
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
  // Champs spécifiques aux profils, directement sur l'objet UserFormData
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  companyName?: string;
  activityType?: string;
  companyAddress?: string;
  // Les profils imbriqués sont maintenant gérés directement
  farmerProfile?: FarmerProfile; // Gardé pour la compatibilité avec le formulaire
  buyerProfile?: BuyerProfile; // Gardé pour la compatibilité avec le formulaire
};

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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

    {user.role === "FARMER" && (
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mt-6 mb-3">Profil Agriculteur</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nom de la ferme"
            name="farmName"
            type="text"
            value={user.farmName || ""}
            onChange={onChange}
            placeholder="Ferme du Bonheur"
            required
          />
          <FormField
            label="Localisation de la ferme"
            name="farmLocation"
            type="text"
            value={user.farmLocation || ""}
            onChange={onChange}
            placeholder="Yamoussoukro, Côte d'Ivoire"
            required
          />
          <FormField
            label="Taille de la ferme (hectares)"
            name="farmSize"
            type="text"
            value={user.farmSize || ""}
            onChange={onChange}
            placeholder="100 hectares"
          />
        </div>
      </div>
    )}

    {user.role === "BUYER" && (
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mt-6 mb-3">Profil Acheteur</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nom de l'entreprise"
            name="companyName"
            type="text"
            value={user.companyName || ""}
            onChange={onChange}
            placeholder="Agro Distribution SARL"
            required
          />
          <FormField
            label="Type d'activité"
            name="activityType"
            type="text"
            value={user.activityType || ""}
            onChange={onChange}
            placeholder="Grossiste"
          />
          <FormField
            label="Adresse de l'entreprise"
            name="companyAddress"
            type="text"
            value={user.companyAddress || ""}
            onChange={onChange}
            placeholder="10 Rue de la Commerce"
          />
        </div>
      </div>
    )}
  </div>
);


export default UserForm;
