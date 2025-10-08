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
  status: "PENDING", // Gardé pour le formulaire, mais sera géré par 'active'
  farmName: "",
  farmLocation: "",
  farmSize: "",
  companyName: "",
  activityType: "",
  companyAddress: "",
};
