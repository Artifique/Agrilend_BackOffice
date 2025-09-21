// Validateurs pour AGRILEND
import { FORM_VALIDATION } from '../constants';

// Interface pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
}

// Interface pour les résultats de validation
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validateur de base
export class BaseValidator {
  protected errors: ValidationError[] = [];

  protected addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  protected clearErrors(): void {
    this.errors = [];
  }

  protected isValidEmail(email: string): boolean {
    return FORM_VALIDATION.EMAIL_REGEX.test(email);
  }

  protected isValidPhone(phone: string): boolean {
    return FORM_VALIDATION.PHONE_REGEX.test(phone);
  }

  protected isValidPassword(password: string): boolean {
    return password.length >= FORM_VALIDATION.PASSWORD_MIN_LENGTH;
  }

  protected isValidName(name: string): boolean {
    return name.length >= FORM_VALIDATION.NAME_MIN_LENGTH && 
           name.length <= FORM_VALIDATION.NAME_MAX_LENGTH;
  }

  protected isRequired(value: unknown): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  protected isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  protected isNonNegativeNumber(value: number): boolean {
    return typeof value === 'number' && value >= 0;
  }

  protected isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  protected isValidDate(date: string): boolean {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  protected isFutureDate(date: string): boolean {
    const dateObj = new Date(date);
    return dateObj > new Date();
  }

  protected isPastDate(date: string): boolean {
    const dateObj = new Date(date);
    return dateObj < new Date();
  }

  public getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }
}

// Validateur pour les utilisateurs
export class UserValidator extends BaseValidator {
  validateUser(userData: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    password?: string;
  }): ValidationResult {
    this.clearErrors();

    // Validation du nom
    if (userData.name !== undefined) {
      if (!this.isRequired(userData.name)) {
        this.addError('name', 'Le nom est requis');
      } else if (!this.isValidName(userData.name)) {
        this.addError('name', 'Le nom doit contenir entre 2 et 50 caractères');
      }
    }

    // Validation de l'email
    if (userData.email !== undefined) {
      if (!this.isRequired(userData.email)) {
        this.addError('email', 'L\'email est requis');
      } else if (!this.isValidEmail(userData.email)) {
        this.addError('email', 'Format d\'email invalide');
      }
    }

    // Validation du téléphone
    if (userData.phone !== undefined) {
      if (!this.isRequired(userData.phone)) {
        this.addError('phone', 'Le téléphone est requis');
      } else if (!this.isValidPhone(userData.phone)) {
        this.addError('phone', 'Format de téléphone invalide');
      }
    }

    // Validation du rôle
    if (userData.role !== undefined) {
      const validRoles = ['farmer', 'buyer', 'admin'];
      if (!this.isRequired(userData.role)) {
        this.addError('role', 'Le rôle est requis');
      } else if (!validRoles.includes(userData.role)) {
        this.addError('role', 'Rôle invalide');
      }
    }

    // Validation du mot de passe
    if (userData.password !== undefined) {
      if (!this.isRequired(userData.password)) {
        this.addError('password', 'Le mot de passe est requis');
      } else if (!this.isValidPassword(userData.password)) {
        this.addError('password', 'Le mot de passe doit contenir au moins 8 caractères');
      }
    }

    return this.getResult();
  }
}

// Validateur pour les commandes
export class OrderValidator extends BaseValidator {
  validateOrder(orderData: {
    product?: string;
    description?: string;
    farmer?: string;
    buyer?: string;
    quantity?: number;
    unitPrice?: number;
    location?: string;
    category?: string;
    deliveryDate?: string;
  }): ValidationResult {
    this.clearErrors();

    // Validation du produit
    if (orderData.product !== undefined) {
      if (!this.isRequired(orderData.product)) {
        this.addError('product', 'Le produit est requis');
      }
    }

    // Validation de la description
    if (orderData.description !== undefined) {
      if (!this.isRequired(orderData.description)) {
        this.addError('description', 'La description est requise');
      }
    }

    // Validation de l'agriculteur
    if (orderData.farmer !== undefined) {
      if (!this.isRequired(orderData.farmer)) {
        this.addError('farmer', 'L\'agriculteur est requis');
      }
    }

    // Validation de l'acheteur
    if (orderData.buyer !== undefined) {
      if (!this.isRequired(orderData.buyer)) {
        this.addError('buyer', 'L\'acheteur est requis');
      }
    }

    // Validation de la quantité
    if (orderData.quantity !== undefined) {
      if (!this.isRequired(orderData.quantity)) {
        this.addError('quantity', 'La quantité est requise');
      } else if (!this.isPositiveNumber(orderData.quantity)) {
        this.addError('quantity', 'La quantité doit être positive');
      }
    }

    // Validation du prix unitaire
    if (orderData.unitPrice !== undefined) {
      if (!this.isRequired(orderData.unitPrice)) {
        this.addError('unitPrice', 'Le prix unitaire est requis');
      } else if (!this.isPositiveNumber(orderData.unitPrice)) {
        this.addError('unitPrice', 'Le prix unitaire doit être positif');
      }
    }

    // Validation de la localisation
    if (orderData.location !== undefined) {
      if (!this.isRequired(orderData.location)) {
        this.addError('location', 'La localisation est requise');
      }
    }

    // Validation de la catégorie
    if (orderData.category !== undefined) {
      const validCategories = ['vegetables', 'fruits', 'grains', 'livestock', 'other'];
      if (!this.isRequired(orderData.category)) {
        this.addError('category', 'La catégorie est requise');
      } else if (!validCategories.includes(orderData.category)) {
        this.addError('category', 'Catégorie invalide');
      }
    }

    // Validation de la date de livraison
    if (orderData.deliveryDate !== undefined) {
      if (!this.isRequired(orderData.deliveryDate)) {
        this.addError('deliveryDate', 'La date de livraison est requise');
      } else if (!this.isValidDate(orderData.deliveryDate)) {
        this.addError('deliveryDate', 'Format de date invalide');
      } else if (!this.isFutureDate(orderData.deliveryDate)) {
        this.addError('deliveryDate', 'La date de livraison doit être dans le futur');
      }
    }

    return this.getResult();
  }
}

// Validateur pour les produits
export class ProductValidator extends BaseValidator {
  validateProduct(productData: {
    name?: string;
    category?: string;
    description?: string;
    farmer?: string;
    price?: number;
    quantity?: number;
    unit?: string;
    location?: string;
    harvestDate?: string;
  }): ValidationResult {
    this.clearErrors();

    // Validation du nom
    if (productData.name !== undefined) {
      if (!this.isRequired(productData.name)) {
        this.addError('name', 'Le nom du produit est requis');
      }
    }

    // Validation de la catégorie
    if (productData.category !== undefined) {
      const validCategories = ['vegetables', 'fruits', 'grains', 'livestock', 'other'];
      if (!this.isRequired(productData.category)) {
        this.addError('category', 'La catégorie est requise');
      } else if (!validCategories.includes(productData.category)) {
        this.addError('category', 'Catégorie invalide');
      }
    }

    // Validation de la description
    if (productData.description !== undefined) {
      if (!this.isRequired(productData.description)) {
        this.addError('description', 'La description est requise');
      }
    }

    // Validation de l'agriculteur
    if (productData.farmer !== undefined) {
      if (!this.isRequired(productData.farmer)) {
        this.addError('farmer', 'L\'agriculteur est requis');
      }
    }

    // Validation du prix
    if (productData.price !== undefined) {
      if (!this.isRequired(productData.price)) {
        this.addError('price', 'Le prix est requis');
      } else if (!this.isPositiveNumber(productData.price)) {
        this.addError('price', 'Le prix doit être positif');
      }
    }

    // Validation de la quantité
    if (productData.quantity !== undefined) {
      if (!this.isRequired(productData.quantity)) {
        this.addError('quantity', 'La quantité est requise');
      } else if (!this.isPositiveNumber(productData.quantity)) {
        this.addError('quantity', 'La quantité doit être positive');
      }
    }

    // Validation de l'unité
    if (productData.unit !== undefined) {
      const validUnits = ['kg', 'piece', 'ton', 'box'];
      if (!this.isRequired(productData.unit)) {
        this.addError('unit', 'L\'unité est requise');
      } else if (!validUnits.includes(productData.unit)) {
        this.addError('unit', 'Unité invalide');
      }
    }

    // Validation de la localisation
    if (productData.location !== undefined) {
      if (!this.isRequired(productData.location)) {
        this.addError('location', 'La localisation est requise');
      }
    }

    // Validation de la date de récolte
    if (productData.harvestDate !== undefined) {
      if (!this.isRequired(productData.harvestDate)) {
        this.addError('harvestDate', 'La date de récolte est requise');
      } else if (!this.isValidDate(productData.harvestDate)) {
        this.addError('harvestDate', 'Format de date invalide');
      }
    }

    return this.getResult();
  }
}

// Validateur pour les litiges
export class DisputeValidator extends BaseValidator {
  validateDispute(disputeData: {
    farmer?: string;
    buyer?: string;
    orderId?: number;
    productType?: string;
    category?: string;
    description?: string;
    priority?: string;
  }): ValidationResult {
    this.clearErrors();

    // Validation de l'agriculteur
    if (disputeData.farmer !== undefined) {
      if (!this.isRequired(disputeData.farmer)) {
        this.addError('farmer', 'L\'agriculteur est requis');
      }
    }

    // Validation de l'acheteur
    if (disputeData.buyer !== undefined) {
      if (!this.isRequired(disputeData.buyer)) {
        this.addError('buyer', 'L\'acheteur est requis');
      }
    }

    // Validation de l'ID de commande
    if (disputeData.orderId !== undefined) {
      if (!this.isRequired(disputeData.orderId)) {
        this.addError('orderId', 'L\'ID de commande est requis');
      } else if (!this.isPositiveNumber(disputeData.orderId)) {
        this.addError('orderId', 'L\'ID de commande doit être positif');
      }
    }

    // Validation du type de produit
    if (disputeData.productType !== undefined) {
      if (!this.isRequired(disputeData.productType)) {
        this.addError('productType', 'Le type de produit est requis');
      }
    }

    // Validation de la catégorie
    if (disputeData.category !== undefined) {
      const validCategories = ['non-delivery', 'cancellation', 'quality', 'payment', 'logistics', 'other'];
      if (!this.isRequired(disputeData.category)) {
        this.addError('category', 'La catégorie est requise');
      } else if (!validCategories.includes(disputeData.category)) {
        this.addError('category', 'Catégorie invalide');
      }
    }

    // Validation de la description
    if (disputeData.description !== undefined) {
      if (!this.isRequired(disputeData.description)) {
        this.addError('description', 'La description est requise');
      }
    }

    // Validation de la priorité
    if (disputeData.priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!this.isRequired(disputeData.priority)) {
        this.addError('priority', 'La priorité est requise');
      } else if (!validPriorities.includes(disputeData.priority)) {
        this.addError('priority', 'Priorité invalide');
      }
    }

    return this.getResult();
  }
}

// Validateur pour les paramètres de prix
export class PricingValidator extends BaseValidator {
  validatePricingConfig(configData: {
    category?: string;
    basePrice?: number;
    commissionRate?: number;
    marginRate?: number;
    minPrice?: number;
    maxPrice?: number;
  }): ValidationResult {
    this.clearErrors();

    // Validation de la catégorie
    if (configData.category !== undefined) {
      if (!this.isRequired(configData.category)) {
        this.addError('category', 'La catégorie est requise');
      }
    }

    // Validation du prix de base
    if (configData.basePrice !== undefined) {
      if (!this.isRequired(configData.basePrice)) {
        this.addError('basePrice', 'Le prix de base est requis');
      } else if (!this.isPositiveNumber(configData.basePrice)) {
        this.addError('basePrice', 'Le prix de base doit être positif');
      }
    }

    // Validation du taux de commission
    if (configData.commissionRate !== undefined) {
      if (!this.isRequired(configData.commissionRate)) {
        this.addError('commissionRate', 'Le taux de commission est requis');
      } else if (!this.isNonNegativeNumber(configData.commissionRate)) {
        this.addError('commissionRate', 'Le taux de commission doit être positif ou nul');
      } else if (!this.isInRange(configData.commissionRate, 0, 100)) {
        this.addError('commissionRate', 'Le taux de commission doit être entre 0 et 100%');
      }
    }

    // Validation du taux de marge
    if (configData.marginRate !== undefined) {
      if (!this.isRequired(configData.marginRate)) {
        this.addError('marginRate', 'Le taux de marge est requis');
      } else if (!this.isNonNegativeNumber(configData.marginRate)) {
        this.addError('marginRate', 'Le taux de marge doit être positif ou nul');
      } else if (!this.isInRange(configData.marginRate, 0, 100)) {
        this.addError('marginRate', 'Le taux de marge doit être entre 0 et 100%');
      }
    }

    // Validation du prix minimum
    if (configData.minPrice !== undefined) {
      if (!this.isRequired(configData.minPrice)) {
        this.addError('minPrice', 'Le prix minimum est requis');
      } else if (!this.isNonNegativeNumber(configData.minPrice)) {
        this.addError('minPrice', 'Le prix minimum doit être positif ou nul');
      }
    }

    // Validation du prix maximum
    if (configData.maxPrice !== undefined) {
      if (!this.isRequired(configData.maxPrice)) {
        this.addError('maxPrice', 'Le prix maximum est requis');
      } else if (!this.isPositiveNumber(configData.maxPrice)) {
        this.addError('maxPrice', 'Le prix maximum doit être positif');
      }
    }

    // Validation de la cohérence des prix
    if (configData.minPrice !== undefined && configData.maxPrice !== undefined) {
      if (configData.minPrice >= configData.maxPrice) {
        this.addError('maxPrice', 'Le prix maximum doit être supérieur au prix minimum');
      }
    }

    return this.getResult();
  }
}

// Validateur pour les livraisons
export class DeliveryValidator extends BaseValidator {
  validateDelivery(deliveryData: {
    orderId?: number;
    farmer?: string;
    buyer?: string;
    product?: string;
    quantity?: number;
    pickupLocation?: string;
    deliveryLocation?: string;
    scheduledDate?: string;
  }): ValidationResult {
    this.clearErrors();

    // Validation de l'ID de commande
    if (deliveryData.orderId !== undefined) {
      if (!this.isRequired(deliveryData.orderId)) {
        this.addError('orderId', 'L\'ID de commande est requis');
      } else if (!this.isPositiveNumber(deliveryData.orderId)) {
        this.addError('orderId', 'L\'ID de commande doit être positif');
      }
    }

    // Validation de l'agriculteur
    if (deliveryData.farmer !== undefined) {
      if (!this.isRequired(deliveryData.farmer)) {
        this.addError('farmer', 'L\'agriculteur est requis');
      }
    }

    // Validation de l'acheteur
    if (deliveryData.buyer !== undefined) {
      if (!this.isRequired(deliveryData.buyer)) {
        this.addError('buyer', 'L\'acheteur est requis');
      }
    }

    // Validation du produit
    if (deliveryData.product !== undefined) {
      if (!this.isRequired(deliveryData.product)) {
        this.addError('product', 'Le produit est requis');
      }
    }

    // Validation de la quantité
    if (deliveryData.quantity !== undefined) {
      if (!this.isRequired(deliveryData.quantity)) {
        this.addError('quantity', 'La quantité est requise');
      } else if (!this.isPositiveNumber(deliveryData.quantity)) {
        this.addError('quantity', 'La quantité doit être positive');
      }
    }

    // Validation du lieu de ramassage
    if (deliveryData.pickupLocation !== undefined) {
      if (!this.isRequired(deliveryData.pickupLocation)) {
        this.addError('pickupLocation', 'Le lieu de ramassage est requis');
      }
    }

    // Validation du lieu de livraison
    if (deliveryData.deliveryLocation !== undefined) {
      if (!this.isRequired(deliveryData.deliveryLocation)) {
        this.addError('deliveryLocation', 'Le lieu de livraison est requis');
      }
    }

    // Validation de la date programmée
    if (deliveryData.scheduledDate !== undefined) {
      if (!this.isRequired(deliveryData.scheduledDate)) {
        this.addError('scheduledDate', 'La date programmée est requise');
      } else if (!this.isValidDate(deliveryData.scheduledDate)) {
        this.addError('scheduledDate', 'Format de date invalide');
      } else if (!this.isFutureDate(deliveryData.scheduledDate)) {
        this.addError('scheduledDate', 'La date programmée doit être dans le futur');
      }
    }

    return this.getResult();
  }
}

// Export des instances de validateurs
export const userValidator = new UserValidator();
export const orderValidator = new OrderValidator();
export const productValidator = new ProductValidator();
export const disputeValidator = new DisputeValidator();
export const pricingValidator = new PricingValidator();
export const deliveryValidator = new DeliveryValidator();
