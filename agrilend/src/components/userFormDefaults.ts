import { UserFormData } from "./UserForm";

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
