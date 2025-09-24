import React, { useMemo, useState, useEffect } from "react";
import {
  Users,
  Plus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import UserForm, { UserFormData, User } from "../components/UserForm";
import { initialUserForm } from "../components/userFormConstants";
const UsersManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>(initialUserForm);
  const [allUsers, setAllUsers] = useState<User[]>([]); // State to hold fetched users

  // Function to simulate fetching users from an API
  const fetchUsers = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fetchedUsers: User[] = [
      {
        id: 1,
        firstName: "Jean",
        lastName: "Kouassi",
        email: "jean.kouassi@email.com",
        phone: "+225 07 12 34 56",
        address: "Abidjan, Côte d'Ivoire",
        hederaAccountId: "0.0.1001",
        createdAt: "2024-01-15",
        status: "ACTIVE",
        role: "FARMER",
        isActive: true,
        emailVerified: true,
        ordersCount: 3,
        totalAmount: 450.0,
        farmerProfile: {
          farmName: "Ferme Kouassi",
          farmLocation: "Abidjan",
        },
      },
      {
        id: 2,
        firstName: "Marie",
        lastName: "Traoré",
        email: "marie.traore@email.com",
        phone: "+225 07 23 45 67",
        address: "Bouaké, Côte d'Ivoire",
        hederaAccountId: "0.0.1002",
        createdAt: "2024-01-10",
        status: "ACTIVE",
        role: "BUYER",
        isActive: true,
        emailVerified: true,
        ordersCount: 5,
        totalAmount: 1200.0,
        buyerProfile: {
          companyName: "Agro Distribution SARL",
        },
      },
      {
        id: 3,
        firstName: "Amadou",
        lastName: "Diallo",
        email: "amadou.diallo@email.com",
        phone: "+225 07 34 56 78",
        address: "Yamoussoukro, Côte d'Ivoire",
        hederaAccountId: "0.0.1003",
        createdAt: "2024-01-08",
        status: "PENDING",
        role: "FARMER",
        isActive: true,
        emailVerified: false,
        ordersCount: 0,
        totalAmount: 0.0,
        farmerProfile: {
          farmName: "Ferme Diallo",
          farmLocation: "Yamoussoukro",
        },
      },
      {
        id: 4,
        firstName: "Fatou",
        lastName: "Sissoko",
        email: "fatou.sissoko@email.com",
        phone: "+225 07 45 67 89",
        address: "San-Pédro, Côte d'Ivoire",
        hederaAccountId: "0.0.1004",
        createdAt: "2024-01-05",
        status: "ACTIVE",
        role: "BUYER",
        isActive: true,
        emailVerified: true,
        ordersCount: 2,
        totalAmount: 300.0,
        buyerProfile: {
          companyName: "Ivoire Fruits",
        },
      },
      {
        id: 5,
        firstName: "Kouadio",
        lastName: "N'Guessan",
        email: "kouadio.nguessan@email.com",
        phone: "+225 07 56 78 90",
        address: "Grand-Bassam, Côte d'Ivoire",
        hederaAccountId: "0.0.1005",
        createdAt: "2024-01-03",
        status: "INACTIVE",
        role: "FARMER",
        isActive: false,
        emailVerified: true,
        ordersCount: 1,
        totalAmount: 150.0,
        farmerProfile: {
          farmName: "Ferme N'Guessan",
          farmLocation: "Grand-Bassam",
        },
      },
    ];
    setAllUsers(fetchedUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("id", {
          header: "ID",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("firstName", {
          header: "Prénom",
          cell: (info) => (
            <div className="font-medium text-gray-900">{info.getValue()}</div>
          ),
        }),
        columnHelper.accessor("lastName", {
          header: "Nom",
          cell: (info) => (
            <div className="font-medium text-gray-900">{info.getValue()}</div>
          ),
        }),
        columnHelper.accessor("email", {
          header: "Email",
          cell: (info) => (
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor("phone", {
          header: "Téléphone",
          cell: (info) => (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor("role", {
          header: "Rôle",
          cell: (info) => {
            const role = info.getValue();
            const roleConfig = {
              FARMER: {
                label: "Agriculteur",
                color: "bg-green-100 text-green-800",
              },
              BUYER: { label: "Acheteur", color: "bg-blue-100 text-blue-800" },
              ADMIN: { label: "Admin", color: "bg-purple-100 text-purple-800" },
            };
            const config = roleConfig[role];

            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
              >
                {config.label}
              </span>
            );
          },
        }),
        columnHelper.accessor("status", {
          header: "Statut",
          cell: (info) => {
            const status = info.getValue();
            const statusConfig = {
              ACTIVE: {
                label: "Actif",
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
              },
              PENDING: {
                label: "En attente",
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
              },
              INACTIVE: {
                label: "Inactif",
                color: "bg-red-100 text-red-800",
                icon: XCircle,
              },
            };
            const config = statusConfig[status];
            const Icon = config.icon;

            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
              </span>
            );
          },
        }),
        columnHelper.accessor("createdAt", {
          header: "Date d'inscription",
          cell: (info) => (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              {new Date(info.getValue()).toLocaleDateString("fr-FR")}
            </div>
          ),
        }),
        columnHelper.accessor("ordersCount", {
          header: "Commandes",
          cell: (info) => (
            <div className="text-center">
              <span className="font-medium text-gray-900">
                {info.getValue()}
              </span>
            </div>
          ),
        }),
        columnHelper.accessor("totalAmount", {
          header: "Montant Total",
          cell: (info) => (
            <div className="text-right">
              <span className="font-medium text-green-600">
                €{info.getValue().toFixed(2)}
              </span>
            </div>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleView(row.original)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Voir les détails"
              >
                <Users className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEdit(row.original)}
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
                title="Modifier"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(row.original)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ),
        }),
      ] as ColumnDef<User, unknown>[],
    [columnHelper]
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    profileType: "farmerProfile" | "buyerProfile"
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [name]: value,
      },
    }));
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user: User) => {
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      hederaAccountId: user.hederaAccountId || "",
      role: user.role,
      status: user.status,
      farmerProfile: user.farmerProfile
        ? { ...user.farmerProfile }
        : initialUserForm.farmerProfile,
      buyerProfile: user.buyerProfile
        ? { ...user.buyerProfile }
        : initialUserForm.buyerProfile,
    });
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setNewUser(initialUserForm); // Reset form for new user
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewUser(initialUserForm);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setNewUser(initialUserForm);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingUser(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to create user
      // Example: const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newUser),
      // });
      // const data = await response.json();
      // console.log('User created:', data);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Submitting new user:", newUser);

      alert("Utilisateur ajouté avec succès !");
      handleCloseModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Erreur lors de l'ajout de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to update user
      // Example: const response = await fetch(`/api/users/${editingUser.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newUser),
      // });
      // const data = await response.json();
      // console.log('User updated:', data);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Submitting edited user:", newUser);

      alert("Utilisateur modifié avec succès !");
      handleCloseEditModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Erreur lors de la modification de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDelete = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to delete user
      // Example: await fetch(`/api/users/${deletingUser.id}`, {
      //   method: 'DELETE',
      // });

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Deleting user:", deletingUser);

      alert("Utilisateur supprimé avec succès !");
      handleCloseDeleteModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "INACTIVE":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "FARMER":
        return "text-green-600 bg-green-50";
      case "BUYER":
        return "text-blue-600 bg-blue-50";
      case "ADMIN":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les agriculteurs, acheteurs et administrateurs de la
              plateforme
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Utilisateurs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs Actifs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allUsers.filter((user) => user.status === "ACTIVE").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {allUsers.filter((user) => user.status === "PENDING").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {allUsers.filter((user) => user.status === "INACTIVE").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <DataTable
          data={allUsers}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      {/* Modal d'ajout d'utilisateur */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Nouvel Utilisateur"
        type="default"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitUser}
          onCancel={handleCloseModal}
          submitText="Créer l'utilisateur"
          isLoading={isLoading}
        >
          <UserForm
            user={newUser}
            onChange={handleInputChange}
            onProfileChange={handleProfileChange}
            isNewUser={true}
          />
        </ModalForm>
      </Modal>

      {/* Modal d'édition d'utilisateur */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title="Modifier l'Utilisateur"
        type="info"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitEdit}
          onCancel={handleCloseEditModal}
          submitText="Modifier l'utilisateur"
          isLoading={isLoading}
        >
          <UserForm
            user={newUser}
            onChange={handleInputChange}
            onProfileChange={handleProfileChange}
            isNewUser={false}
          />
        </ModalForm>
      </Modal>

      {/* Modal de visualisation d'utilisateur */}
      <Modal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Détails de l'Utilisateur"
        type="default"
        size="lg"
      >
        {viewingUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations Personnelles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-900">
                        {viewingUser.firstName} {viewingUser.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {viewingUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">
                        {viewingUser.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Date d'inscription
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewingUser.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                  {viewingUser.hederaAccountId && (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">
                          ID Compte Hedera
                        </p>
                        <p className="font-medium text-gray-900">
                          {viewingUser.hederaAccountId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statut et Activité
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        viewingUser.status
                      )}`}
                    >
                      {viewingUser.status === "ACTIVE" && "Actif"}
                      {viewingUser.status === "PENDING" && "En attente"}
                      {viewingUser.status === "INACTIVE" && "Inactif"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                        viewingUser.role
                      )}`}
                    >
                      {viewingUser.role === "FARMER" && "Agriculteur"}
                      {viewingUser.role === "BUYER" && "Acheteur"}
                      {viewingUser.role === "ADMIN" && "Administrateur"}
                    </span>
                  </div>

                  {viewingUser.role === "FARMER" &&
                    viewingUser.farmerProfile && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Nom de la ferme :</strong>{" "}
                          {viewingUser.farmerProfile.farmName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Localisation de la ferme :</strong>{" "}
                          {viewingUser.farmerProfile.farmLocation}
                        </p>
                      </div>
                    )}

                  {viewingUser.role === "BUYER" && viewingUser.buyerProfile && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Nom de l'entreprise :</strong>{" "}
                        {viewingUser.buyerProfile.companyName}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Commandes :</strong> {viewingUser.ordersCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Montant total :</strong> €
                      {viewingUser.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(viewingUser);
                }}
                className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#1E90FF]/90 transition-colors duration-200"
              >
                Modifier
              </button>
              <button
                onClick={handleCloseViewModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de suppression d'utilisateur */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Supprimer l'Utilisateur"
        type="error"
        size="sm"
      >
        {deletingUser && (
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {deletingUser.firstName}{" "}
                {deletingUser.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email :</strong> {deletingUser.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rôle :</strong>{" "}
                {deletingUser.role === "FARMER"
                  ? "Agriculteur"
                  : deletingUser.role === "BUYER"
                  ? "Acheteur"
                  : "Administrateur"}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Supprimer
              </button>
              <button
                onClick={handleCloseDeleteModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default UsersManagement;
