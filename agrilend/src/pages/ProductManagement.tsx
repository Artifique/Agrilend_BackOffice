import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ManagementPage } from "../components/ManagementPage";
import { createProduct, Product, getProducts, deactivateProduct, updateProduct } from "../services/productService";
import { Row } from "@tanstack/react-table";
import { Trash2, Plus, Package, Edit } from "lucide-react";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: Row<Product> }) => row.original.id,
    },
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }: { row: Row<Product> }) => row.original.name,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: Row<Product> }) => row.original.description,
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }: { row: Row<Product> }) => row.original.category,
    },
    {
      accessorKey: "unit",
      header: "Unité",
      cell: ({ row }: { row: Row<Product> }) => row.original.unit,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Product> }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { /* productEntity.handleEdit(row.original) */ }}
            className="text-green-600 hover:text-green-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => { /* productEntity.handleDelete(row.original.id, fetchProducts) */ }}
            className="text-red-600 hover:text-red-800"
            title="Désactiver"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []); // Removed productEntity from dependencies

  const formFields = [
    { name: "name", label: "Nom du produit", type: "text" as const, required: true },
    { name: "description", label: "Description", type: "textarea" as const, required: true },
    { name: "category", label: "Catégorie", type: "text" as const, required: true },
    { name: "subcategory", label: "Sous-catégorie", type: "text" as const },
    {
      name: "unit",
      label: "Unité",
      type: "select" as const,
      required: true,
      options: [
        { value: "KG", label: "KG" },
        { value: "TON", label: "TON" },
        { value: "LITER", label: "Litre" },
        { value: "PIECE", label: "Pièce" },
        { value: "BOX", label: "Boîte" },
        { value: "PALLET", label: "Palette" },
      ],
    },
  ];

  return (
    <ManagementPage<Product>
      config={{
        title: "Gestion des Produits",
        description: "Gérez les produits de la plateforme.",
        icon: Package,
        stats: [],
        formFields,
        viewFields: formFields, // Simplified for now
        columns: columns,
        defaultFormData: { name: "", description: "", category: "", unit: "KG" },
      }}
      data={products}
      onRefresh={fetchProducts}
      service={{
        create: createProduct,
        update: (id, data) => updateProduct(id.toString(), data),
        remove: (id) => deactivateProduct(id.toString()),
      }}
    />
  );
};

export default ProductManagement;
