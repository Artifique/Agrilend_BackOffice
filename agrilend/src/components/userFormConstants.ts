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
  status: "PENDING",
  farmerProfile: {
    farmName: "",
    farmLocation: "",
  },
  buyerProfile: {
    companyName: "",
  },
};
