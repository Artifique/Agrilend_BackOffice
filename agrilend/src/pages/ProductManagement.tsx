import React, { useState, useMemo, useEffect } from "react";
import {
  Package, // Icône pour les produits
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  Image as ImageIcon, // Renommer pour éviter le conflit avec Image de React
} from "lucide-react";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { useNotificationHelpers } from "../hooks/useNotificationHelpers";
import { Product, getAllProducts, createProduct, updateProduct, deactivateProduct, activateProduct } from "../services/productService";

const ProductManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [activatingProduct, setActivatingProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const { showSuccess, showError } = useNotificationHelpers();

  // État pour le nouveau produit/produit édité
  const [newProduct, setNewProduct] = useState<Product>({ // Initialisation avec des valeurs par défaut
    id: 0,
    name: "",
    description: "",
    category: "",
    subcategory: "",
    unit: "",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: true,
  });

  // Fonctions pour fermer les modales
  const handleCloseViewModal = () => setShowViewModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseActivateModal = () => setShowActivateModal(false);

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getAllProducts();
      setAllProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      showError("Erreur de chargement", "Impossible de charger la liste des produits.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columnHelper = createColumnHelper<Product>();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("id", {
          header: "ID",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("name", {
          header: "Nom du Produit",
          cell: (info) => (
            <div className="font-medium text-gray-900">{info.getValue()}</div>
          ),
        }),
        columnHelper.accessor("category", {
          header: "Catégorie",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("subcategory", {
          header: "Sous-catégorie",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("unit", {
          header: "Unité",
          cell: (info) => info.getValue(),
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
          header: "Date de Création",
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
                <Package className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEdit(row.original)}
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </button>
              {!row.original.active && ( // Afficher le bouton Activer si le produit est inactif
                <button
                  onClick={() => handleActivate(row.original)}
                  className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                  title="Activer"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              {row.original.active && ( // Afficher le bouton Désactiver si le produit est actif
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
      ] as ColumnDef<Product, unknown>[],
    [columnHelper]
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
    });
    setShowEditModal(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleActivate = (product: Product) => {
    setActivatingProduct(product);
    setShowActivateModal(true);
  };

  const handleAddProduct = () => {
    setNewProduct({
      id: 0,
      name: "",
      description: "",
      category: "",
      subcategory: "",
      unit: "",
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewProduct({
      id: 0,
      name: "",
      description: "",
      category: "",
      subcategory: "",
      unit: "",
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    });
  };

  // TODO: Implémenter handleSubmitAddProduct, handleSubmitEditProduct, handleSubmitDeleteProduct, handleSubmitActivateProduct
  const handleSubmitAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        unit: newProduct.unit,
        imageUrl: newProduct.imageUrl || undefined,
      };
      await createProduct(productData);
      showSuccess("Succès", "Produit ajouté avec succès !");
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      showError("Erreur", "Erreur lors de l'ajout du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!editingProduct) {
        showError("Erreur", "Aucun produit sélectionné pour la modification.");
        return;
      }
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        unit: newProduct.unit,
        imageUrl: newProduct.imageUrl || null,
        active: newProduct.active, // Utiliser le statut actif du formulaire
      };
      await updateProduct(editingProduct.id, productData);
      showSuccess("Succès", "Produit modifié avec succès !");
      handleCloseEditModal();
      fetchProducts();
    } catch (error) {
      console.error("Error editing product:", error);
      showError("Erreur", "Erreur lors de la modification du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDeleteProduct = async () => {
    setIsLoading(true);
    try {
      if (!deletingProduct) {
        showError("Erreur", "Aucun produit sélectionné pour la désactivation.");
        return;
      }
      await deactivateProduct(deletingProduct.id);
      showSuccess("Succès", "Produit désactivé avec succès !");
      handleCloseDeleteModal();
      fetchProducts();
    } catch (error) {
      console.error("Error deactivating product:", error);
      showError("Erreur", "Erreur lors de la désactivation du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitActivateProduct = async () => {
    setIsLoading(true);
    try {
      if (!activatingProduct) {
        showError("Erreur", "Aucun produit sélectionné pour l'activation.");
        return;
      }
      await activateProduct(activatingProduct.id);
      showSuccess("Succès", "Produit activé avec succès !");
      handleCloseActivateModal();
      fetchProducts();
    } catch (error) {
      console.error("Error activating product:", error);
      showError("Erreur", "Erreur lors de l'activation du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (active: boolean) => {
    return active ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              Gestion des Produits
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les produits disponibles sur la plateforme
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Produits
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allProducts.length}
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
                Produits Actifs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {allProducts.filter((product) => product.active).length}
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
              <p className="text-sm font-medium text-gray-600">Produits Inactifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {allProducts.filter((product) => !product.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <DataTable
          data={allProducts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      {/* Modal d'ajout de produit */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Nouveau Produit"
        type="default"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitAddProduct}
          onCancel={handleCloseModal}
          submitText="Créer le produit"
          isLoading={isLoading}
        >
          <FormField
            label="Nom"
            name="name"
            type="text"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={newProduct.description}
            onChange={handleInputChange}
            required
            rows={3}
          />
          <FormField
            label="Catégorie"
            name="category"
            type="text"
            value={newProduct.category}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Sous-catégorie"
            name="subcategory"
            type="text"
            value={newProduct.subcategory}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Unité"
            name="unit"
            type="select"
            value={newProduct.unit}
            onChange={handleInputChange}
            required
            options={[
              { value: "KG", label: "Kilogramme" },
              { value: "TON", label: "Tonne" },
              { value: "LITER", label: "Litre" },
              { value: "PIECE", label: "Pièce" },
              { value: "BOX", label: "Boîte" },
              { value: "PALLET", label: "Palette" },
            ]}
          />
          <FormField
            label="URL Image"
            name="imageUrl"
            type="text"
            value={newProduct.imageUrl || ""}
            onChange={handleInputChange}
          />
        </ModalForm>
      </Modal>

      {/* Modal d'édition de produit */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title="Modifier le Produit"
        type="info"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitEditProduct}
          onCancel={handleCloseEditModal}
          submitText="Modifier le produit"
          isLoading={isLoading}
        >
          <FormField
            label="Nom"
            name="name"
            type="text"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={newProduct.description}
            onChange={handleInputChange}
            required
            rows={3}
          />
          <FormField
            label="Catégorie"
            name="category"
            type="text"
            value={newProduct.category}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Sous-catégorie"
            name="subcategory"
            type="text"
            value={newProduct.subcategory}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Unité"
            name="unit"
            type="select"
            value={newProduct.unit}
            onChange={handleInputChange}
            required
            options={[
              { value: "KG", label: "Kilogramme" },
              { value: "TON", label: "Tonne" },
              { value: "LITER", label: "Litre" },
              { value: "PIECE", label: "Pièce" },
              { value: "BOX", label: "Boîte" },
              { value: "PALLET", label: "Palette" },
            ]}
          />
          <FormField
            label="URL Image"
            name="imageUrl"
            type="text"
            value={newProduct.imageUrl || ""}
            onChange={handleInputChange}
          />
          <FormField
            label="Actif"
            name="active"
            type="select"
            value={newProduct.active ? "true" : "false"}
            onChange={(e) =>
              setNewProduct((prev) => ({
                ...prev,
                active: e.target.value === "true",
              }))
            }
            options={[
              { value: "true", label: "Oui" },
              { value: "false", label: "Non" },
            ]}
          />
        </ModalForm>
      </Modal>

      {/* Modal de visualisation de produit */}
      <Modal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Détails du Produit"
        type="default"
        size="lg"
      >
        {viewingProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations Générales
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium text-gray-900">
                        {viewingProduct.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ImageIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Image</p>
                      {viewingProduct.imageUrl ? (
                        <img
                          src={viewingProduct.imageUrl}
                          alt={viewingProduct.name}
                          className="w-24 h-24 object-cover rounded-lg mt-2"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">Aucune image</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium text-gray-900">
                      {viewingProduct.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Détails Techniques
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <p className="font-medium text-gray-900">
                        {viewingProduct.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Sous-catégorie</p>
                      <p className="font-medium text-gray-900">
                        {viewingProduct.subcategory}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Unité</p>
                      <p className="font-medium text-gray-900">
                        {viewingProduct.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date de Création</p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewingProduct.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Dernière Mise à Jour</p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewingProduct.updatedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <p className="font-medium text-gray-900">
                        {viewingProduct.active ? "Actif" : "Inactif"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(viewingProduct);
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

      {/* Modal de désactivation de produit */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Désactiver le Produit"
        type="error"
        size="sm"
      >
        {deletingProduct && (
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir désactiver ce produit ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cette action peut être annulée en réactivant le produit.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {deletingProduct.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Catégorie :</strong> {deletingProduct.category}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitDeleteProduct}
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

      {/* Modal d'activation de produit */}
      <Modal
        isOpen={showActivateModal}
        onClose={handleCloseActivateModal}
        title="Activer le Produit"
        type="info"
        size="sm"
      >
        {activatingProduct && (
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir activer ce produit ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Le produit sera à nouveau visible et disponible sur la plateforme.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {activatingProduct.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Catégorie :</strong> {activatingProduct.category}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitActivateProduct}
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

export default ProductManagement;
