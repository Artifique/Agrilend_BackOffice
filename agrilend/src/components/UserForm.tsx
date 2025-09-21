import React, { useState } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  type: 'farmer' | 'investor' | 'agent';
  location?: string;
}

interface UserFormProps {
  initialData?: Partial<User> | null;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
}

export default function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    type: initialData?.type || 'farmer',
    location: initialData?.location || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.type) {
      newErrors.type = 'Le type d\'utilisateur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Entrez le nom complet"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="exemple@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+225 XX XX XX XX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* User Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Type d'utilisateur *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.type ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="farmer">Agriculteur</option>
            <option value="investor">Investisseur</option>
            <option value="agent">Agent</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ville, Région"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {initialData ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}