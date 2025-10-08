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
  Edit, // Ajout de l'icône Edit
} from "lucide-react";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import UserForm, { UserFormData, User } from "../components/UserForm";
import { initialUserForm } from "../components/userFormConstants";
import { getAllUsers, registerUser, updateUser, deactivateUser, activateUser } from "../services/userService";
import { useNotificationHelpers } from "../hooks/useNotificationHelpers";

const UsersManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false); // Nouvel état pour le modal d'activation
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null); // Nouvel état pour l'utilisateur en édition
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [activatingUser, setActivatingUser] = useState<User | null>(null); // Nouvel état pour l'utilisateur à activer
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>(initialUserForm);
  const [allUsers, setAllUsers] = useState<User[]>([]); // State to hold fetched users

  const { showSuccess, showError } = useNotificationHelpers();

  // Function to fetch users from an API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setAllUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showError("Erreur de chargement", "Impossible de charger la liste des utilisateurs.");
    } finally {
      setIsLoading(false);
    }
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
        columnHelper.accessor("active", {
          header: "Statut",
          cell: (info) => {
            const isActive = info.getValue();
            const statusConfig = isActive
              ? {
                  label: "Actif",
                  color: "bg-green-100 text-green-800",
                  icon: CheckCircle,
                }
              : {
                  label: "Inactif",
                  color: "bg-red-100 text-red-800",
                  icon: XCircle,
                };
            const Icon = statusConfig.icon;

            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </span>
            );
          },
        }),
        columnHelper.accessor("createdAt", {
          header: "Date de création",
          cell: (info) => (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              {new Date(info.getValue()).toLocaleDateString("fr-FR")}
            </div>
          ),
        }),
        columnHelper.accessor("updatedAt", {
          header: "Dernière MAJ",
          cell: (info) => (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              {info.getValue() ? new Date(info.getValue()!).toLocaleDateString("fr-FR") : "N/A"}
            </div>
          ),
        }),
        columnHelper.accessor("farmName", {
          header: "Nom de la ferme",
          cell: (info) => info.getValue() || "N/A",
        }),
        columnHelper.accessor("companyName", {
          header: "Nom de l'entreprise",
          cell: (info) => info.getValue() || "N/A",
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
                <Edit className="h-4 w-4" />
              </button>
              {!row.original.active && ( // Afficher le bouton Activer si l'utilisateur est inactif
                <button
                  onClick={() => handleActivate(row.original)}
                  className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                  title="Activer"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              {row.original.active && ( // Afficher le bouton Désactiver si l'utilisateur est actif
                <button
                  onClick={() => handleDelete(row.original)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  title="Désactiver"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
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
    setEditingUser(user); // Stocker l'utilisateur complet pour l'édition
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "", // address n'est pas dans le JSON, mais gardé pour le formulaire
      hederaAccountId: user.hederaAccountId || "",
      role: user.role,
      status: user.active ? "ACTIVE" : "INACTIVE", // Déduire le status de 'active'
      farmName: user.farmName || "",
      farmLocation: user.farmLocation || "",
      farmSize: user.farmSize || "",
      companyName: user.companyName || "",
      activityType: user.activityType || "",
      companyAddress: user.companyAddress || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleActivate = (user: User) => {
    setActivatingUser(user);
    setShowActivateModal(true);
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
    setEditingUser(null); // Réinitialiser l'utilisateur en édition
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingUser(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleCloseActivateModal = () => {
    setShowActivateModal(false);
    setActivatingUser(null);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userToRegister: SignupRequest = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password, // Le mot de passe est requis pour l'enregistrement
        phone: newUser.phone || undefined,
        role: newUser.role,
      };

      if (newUser.role === "FARMER") {
        userToRegister.farmName = newUser.farmName || undefined;
        userToRegister.farmLocation = newUser.farmLocation || undefined;
        userToRegister.farmSize = newUser.farmSize || undefined;
      } else if (newUser.role === "BUYER") {
        userToRegister.companyName = newUser.companyName || undefined;
        userToRegister.activityType = newUser.activityType || undefined;
        userToRegister.companyAddress = newUser.companyAddress || undefined;
      }

      await registerUser(userToRegister);

      showSuccess("Succès", "Utilisateur ajouté avec succès !");
      handleCloseModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error creating user:", error);
      showError("Erreur", "Erreur lors de l'ajout de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!editingUser) {
        showError("Erreur", "Aucun utilisateur sélectionné pour la modification.");
        return;
      }

      const userToUpdate: UserProfileDto = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone || undefined,
        address: newUser.address || undefined,
        hederaAccountId: newUser.hederaAccountId || undefined,
        role: newUser.role,
        active: newUser.status === "ACTIVE", // Convertir le status du formulaire en 'active' boolean
        farmName: newUser.farmName || undefined,
        farmLocation: newUser.farmLocation || undefined,
        farmSize: newUser.farmSize || undefined,
        companyName: newUser.companyName || undefined,
        activityType: newUser.activityType || undefined,
        companyAddress: newUser.companyAddress || undefined,
      };

      await updateUser(editingUser.id, userToUpdate);

      showSuccess("Succès", "Utilisateur modifié avec succès !");
      handleCloseEditModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
      showError("Erreur", "Erreur lors de la modification de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDelete = async () => {
    setIsLoading(true);
    try {
      if (!deletingUser) {
        showError("Erreur", "Aucun utilisateur sélectionné pour la désactivation.");
        return;
      }

      await deactivateUser(deletingUser.id);

      showSuccess("Succès", "Utilisateur désactivé avec succès !");
      handleCloseDeleteModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deactivating user:", error);
      showError("Erreur", "Erreur lors de la désactivation de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitActivate = async () => {
    setIsLoading(true);
    try {
      if (!activatingUser) {
        showError("Erreur", "Aucun utilisateur sélectionné pour l'activation.");
        return;
      }

      await activateUser(activatingUser.id);

      showSuccess("Succès", "Utilisateur activé avec succès !");
      handleCloseActivateModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error activating user:", error);
      showError("Erreur", "Erreur lors de l'activation de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (active: boolean) => {
    return active ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
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
                {allUsers.filter((user) => user.active).length}
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
                {allUsers.filter((user) => !user.active).length}
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
                        Date de création
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewingUser.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                  {viewingUser.updatedAt && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Dernière mise à jour
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(viewingUser.updatedAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
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
                        viewingUser.active
                      )}`}
                    >
                      {viewingUser.active ? "Actif" : "Inactif"}
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

                  {viewingUser.role === "FARMER" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Nom de la ferme :</strong>{" "}
                        {viewingUser.farmName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Localisation de la ferme :</strong>{" "}
                        {viewingUser.farmLocation || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Taille de la ferme :</strong>{" "}
                        {viewingUser.farmSize || "N/A"}
                      </p>
                    </div>
                  )}

                  {viewingUser.role === "BUYER" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Nom de l'entreprise :</strong>{" "}
                        {viewingUser.companyName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Type d'activité :</strong>{" "}
                        {viewingUser.activityType || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Adresse de l'entreprise :</strong>{" "}
                        {viewingUser.companyAddress || "N/A"}
                      </p>
                    </div>
                  )}

                  {/* Removed ordersCount and totalAmount as they are not in the provided JSON */}
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
        title="Désactiver l'Utilisateur"
        type="error"
        size="sm"
      >
        {deletingUser && (
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir désactiver cet utilisateur ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cette action peut être annulée en réactivant l'utilisateur.
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
                Désactiver
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

      {/* Modal d'activation d'utilisateur */}
      <Modal
        isOpen={showActivateModal}
        onClose={handleCloseActivateModal}
        title="Activer l'Utilisateur"
        type="info"
        size="sm"
      >
        {activatingUser && (
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir activer cet utilisateur ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  L'utilisateur pourra à nouveau se connecter et utiliser la plateforme.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {activatingUser.firstName}{" "}
                {activatingUser.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email :</strong> {activatingUser.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rôle :</strong>{" "}
                {activatingUser.role === "FARMER"
                  ? "Agriculteur"
                  : activatingUser.role === "BUYER"
                  ? "Acheteur"
                  : "Administrateur"}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitActivate}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Activer
              </button>
              <button
                onClick={handleCloseActivateModal}
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
