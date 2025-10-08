import { UserFormData } from "./UserForm";

export const initialUserForm: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  hederaAccountId: "",
  role: "FARMER",
  status: "ACTIVE", // Défini sur ACTIF par défaut car PENDING est supprimé
  farmName: "",
  farmLocation: "",
  farmSize: "",
  companyName: "",
  activityType: "",
  companyAddress: "",
};
