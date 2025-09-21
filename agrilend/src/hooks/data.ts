// Hook pour la gestion des données statiques optimisées
import { useMemo } from 'react';

// Hook pour les données d'utilisateurs
export const useUsersData = () => {
  return useMemo(() => [
    {
      id: 1,
      name: 'Jean Kouassi',
      email: 'jean.kouassi@email.com',
      phone: '+225 07 12 34 56',
      location: 'Abidjan, Côte d\'Ivoire',
      joinDate: '2024-01-15',
      status: 'active' as const,
      role: 'farmer' as const,
      ordersCount: 3,
      totalAmount: 15000
    },
    {
      id: 2,
      name: 'Marie Diabaté',
      email: 'marie.diabate@email.com',
      phone: '+225 05 98 76 54',
      location: 'Bouaké, Côte d\'Ivoire',
      joinDate: '2024-02-20',
      status: 'active' as const,
      role: 'buyer' as const,
      ordersCount: 0,
      totalAmount: 0
    },
    {
      id: 3,
      name: 'Ibrahim Traoré',
      email: 'ibrahim.traore@email.com',
      phone: '+225 06 11 22 33',
      location: 'San-Pédro, Côte d\'Ivoire',
      joinDate: '2024-03-10',
      status: 'pending' as const,
      role: 'farmer' as const,
      ordersCount: 1,
      totalAmount: 5000
    },
    {
      id: 4,
      name: 'Fatou Keita',
      email: 'fatou.keita@email.com',
      phone: '+225 07 44 55 66',
      location: 'Yamoussoukro, Côte d\'Ivoire',
      joinDate: '2024-01-05',
      status: 'active' as const,
      role: 'admin' as const,
      ordersCount: 0,
      totalAmount: 0
    }
  ], []);
};

// Hook pour les données de litiges
export const useDisputesData = () => {
  return useMemo(() => [
    {
      id: 1,
      title: 'Livraison non effectuée',
      description: 'Le produit n\'a pas été livré à la date prévue',
      farmer: 'Jean Kouassi',
      buyer: 'Restaurant Le Bon Goût',
      orderId: 1001,
      amount: 2500,
      status: 'open' as const,
      priority: 'high' as const,
      createdDate: '2024-01-15',
      lastUpdate: '2024-01-16',
      assignedTo: 'Admin Support',
      category: 'non-delivery' as const,
      location: 'Abidjan, Côte d\'Ivoire',
      productType: 'Tomates',
      hederaTxId: '0.0.123456@1642234567.123456789'
    },
    {
      id: 2,
      title: 'Qualité du produit',
      description: 'Les légumes livrés ne correspondent pas à la qualité commandée',
      farmer: 'Marie Diabaté',
      buyer: 'Hôtel Ivoire',
      orderId: 1002,
      amount: 1800,
      status: 'investigating' as const,
      priority: 'medium' as const,
      createdDate: '2024-01-20',
      lastUpdate: '2024-01-21',
      assignedTo: 'Quality Team',
      category: 'quality' as const,
      location: 'Bouaké, Côte d\'Ivoire',
      productType: 'Légumes verts',
      hederaTxId: '0.0.123457@1642234568.123456790'
    },
    {
      id: 3,
      title: 'Annulation de commande',
      description: 'L\'acheteur a annulé la commande après confirmation',
      farmer: 'Ibrahim Traoré',
      buyer: 'Marché Central',
      orderId: 1003,
      amount: 3200,
      status: 'resolved' as const,
      priority: 'low' as const,
      createdDate: '2024-01-25',
      lastUpdate: '2024-01-26',
      assignedTo: 'Admin Support',
      category: 'cancellation' as const,
      location: 'San-Pédro, Côte d\'Ivoire',
      productType: 'Fruits tropicaux',
      hederaTxId: '0.0.123458@1642234569.123456791'
    }
  ], []);
};

// Hook pour les données de commandes
export const useOrdersData = () => {
  return useMemo(() => [
    {
      id: 1,
      product: 'Tomates fraîches',
      description: 'Tomates biologiques cultivées localement',
      farmer: 'Jean Kouassi',
      buyer: 'Restaurant Le Bon Goût',
      quantity: 50,
      unitPrice: 2.5,
      totalAmount: 125,
      status: 'pending' as const,
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      location: 'Abidjan, Côte d\'Ivoire',
      category: 'vegetables' as const,
      sequesterAmount: 125,
      platformFee: 6.25,
      hederaTxId: '0.0.123456@1642234567.123456789'
    },
    {
      id: 2,
      product: 'Légumes verts',
      description: 'Épinards, laitue et choux frais',
      farmer: 'Marie Diabaté',
      buyer: 'Hôtel Ivoire',
      quantity: 30,
      unitPrice: 3.0,
      totalAmount: 90,
      status: 'sequestered' as const,
      orderDate: '2024-01-18',
      deliveryDate: '2024-01-22',
      location: 'Bouaké, Côte d\'Ivoire',
      category: 'vegetables' as const,
      sequesterAmount: 90,
      platformFee: 4.5,
      hederaTxId: '0.0.123457@1642234568.123456790'
    },
    {
      id: 3,
      product: 'Fruits tropicaux',
      description: 'Mangues, ananas et papayes',
      farmer: 'Ibrahim Traoré',
      buyer: 'Marché Central',
      quantity: 25,
      unitPrice: 4.0,
      totalAmount: 100,
      status: 'delivered' as const,
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-25',
      location: 'San-Pédro, Côte d\'Ivoire',
      category: 'fruits' as const,
      sequesterAmount: 100,
      platformFee: 5.0,
      hederaTxId: '0.0.123458@1642234569.123456791'
    }
  ], []);
};

// Hook pour les données financières
export const useFinancialData = () => {
  return useMemo(() => [
    {
      id: 1,
      orderId: 1001,
      type: 'escrow' as const,
      amount: 2500,
      currency: 'EUR' as const,
      status: 'completed' as const,
      hederaTxId: '0.0.123456@1642234567.123456789',
      timestamp: '2024-01-15T10:30:00Z',
      fees: 125,
      stakingReward: 50
    },
    {
      id: 2,
      orderId: 1002,
      type: 'release' as const,
      amount: 1800,
      currency: 'EUR' as const,
      status: 'completed' as const,
      hederaTxId: '0.0.123457@1642234568.123456790',
      timestamp: '2024-01-20T14:15:00Z',
      fees: 90,
      stakingReward: 36
    },
    {
      id: 3,
      orderId: 1003,
      type: 'staking' as const,
      amount: 3200,
      currency: 'EUR' as const,
      status: 'pending' as const,
      hederaTxId: '0.0.123458@1642234569.123456791',
      timestamp: '2024-01-25T09:45:00Z',
      fees: 160,
      stakingReward: 64
    }
  ], []);
};

// Hook pour les données de livraisons
export const useDeliveriesData = () => {
  return useMemo(() => [
    {
      id: 1,
      orderId: 1001,
      farmer: 'Jean Kouassi',
      buyer: 'Restaurant Le Bon Goût',
      product: 'Tomates fraîches',
      quantity: 50,
      pickupLocation: 'Ferme Kouassi, Abidjan',
      deliveryLocation: 'Restaurant Le Bon Goût, Plateau',
      status: 'scheduled' as const,
      scheduledDate: '2024-01-20',
      driver: 'Kouadio Traoré',
      vehicle: 'Camion réfrigéré A-123-BC',
      trackingNumber: 'TRK001234567',
      notes: 'Livraison prévue entre 8h et 10h'
    },
    {
      id: 2,
      orderId: 1002,
      farmer: 'Marie Diabaté',
      buyer: 'Hôtel Ivoire',
      product: 'Légumes verts',
      quantity: 30,
      pickupLocation: 'Ferme Diabaté, Bouaké',
      deliveryLocation: 'Hôtel Ivoire, Cocody',
      status: 'in-transit' as const,
      scheduledDate: '2024-01-22',
      deliveredDate: '2024-01-22',
      driver: 'Sékou Koné',
      vehicle: 'Van réfrigéré B-456-DE',
      trackingNumber: 'TRK001234568',
      notes: 'En cours de livraison'
    },
    {
      id: 3,
      orderId: 1003,
      farmer: 'Ibrahim Traoré',
      buyer: 'Marché Central',
      product: 'Fruits tropicaux',
      quantity: 25,
      pickupLocation: 'Ferme Traoré, San-Pédro',
      deliveryLocation: 'Marché Central, Abidjan',
      status: 'delivered' as const,
      scheduledDate: '2024-01-25',
      deliveredDate: '2024-01-25',
      driver: 'Moussa Ouattara',
      vehicle: 'Camion C-789-FG',
      trackingNumber: 'TRK001234569',
      notes: 'Livraison effectuée avec succès'
    }
  ], []);
};

// Hook pour les données de produits
export const useProductsData = () => {
  return useMemo(() => [
    {
      id: 1,
      name: 'Tomates biologiques',
      category: 'vegetables' as const,
      description: 'Tomates fraîches cultivées sans pesticides',
      farmer: 'Jean Kouassi',
      price: 2.5,
      quantity: 100,
      unit: 'kg' as const,
      status: 'approved' as const,
      images: ['tomate1.jpg', 'tomate2.jpg'],
      location: 'Abidjan, Côte d\'Ivoire',
      harvestDate: '2024-01-15',
      organic: true,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Légumes verts mélangés',
      category: 'vegetables' as const,
      description: 'Épinards, laitue et choux frais',
      farmer: 'Marie Diabaté',
      price: 3.0,
      quantity: 50,
      unit: 'kg' as const,
      status: 'pending' as const,
      images: ['legumes1.jpg', 'legumes2.jpg'],
      location: 'Bouaké, Côte d\'Ivoire',
      harvestDate: '2024-01-18',
      organic: false,
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Fruits tropicaux',
      category: 'fruits' as const,
      description: 'Mangues, ananas et papayes',
      farmer: 'Ibrahim Traoré',
      price: 4.0,
      quantity: 75,
      unit: 'kg' as const,
      status: 'approved' as const,
      images: ['fruits1.jpg', 'fruits2.jpg'],
      location: 'San-Pédro, Côte d\'Ivoire',
      harvestDate: '2024-01-20',
      organic: true,
      createdAt: '2024-01-18'
    }
  ], []);
};
