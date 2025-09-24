-- Base de données Agrilend
CREATE DATABASE IF NOT EXISTS agrilend;
USE agrilend;

-- Table des utilisateurs (classe parent)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    hedera_account_id VARCHAR(50),
    role ENUM('FARMER', 'BUYER', 'ADMIN') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_hedera_account (hedera_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des agriculteurs (hérite de users)
CREATE TABLE farmers (
    user_id BIGINT PRIMARY KEY,
    farm_name VARCHAR(255) NOT NULL,
    farm_location TEXT,
    farm_size_hectares DECIMAL(10,2),
    certifications JSON, -- Stockage des certifications sous forme JSON
    bank_account_details TEXT, -- Chiffré en production
    farming_since YEAR,
    specializations JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des acheteurs (hérite de users)
CREATE TABLE buyers (
    user_id BIGINT PRIMARY KEY,
    company_name VARCHAR(255),
    business_type VARCHAR(100),
    business_registration_number VARCHAR(100),
    vat_number VARCHAR(50),
    billing_address TEXT,
    shipping_address TEXT,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms_days INT DEFAULT 30,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des produits
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    unit ENUM('KG', 'TONNE', 'LITRE', 'PIECE', 'BOITE', 'PALETTE') NOT NULL,
    image_url VARCHAR(500),
    nutritional_info JSON,
    storage_conditions TEXT,
    shelf_life_days INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des offres
CREATE TABLE offers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    farmer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    quantity_unit ENUM('KG', 'TONNE', 'LITRE', 'PIECE', 'BOITE', 'PALETTE') NOT NULL,
    suggested_price DECIMAL(10,2) NOT NULL,
    harvest_date DATE,
    availability_date DATE NOT NULL,
    expiry_date DATE,
    status ENUM('DRAFT', 'PENDING_VALIDATION', 'ACTIVE', 'SOLD_OUT', 'EXPIRED', 'REJECTED') DEFAULT 'DRAFT',
    admin_validated BOOLEAN DEFAULT FALSE,
    validated_by BIGINT,
    validated_at DATETIME,
    final_price_for_buyer DECIMAL(10,2),
    final_price_for_farmer DECIMAL(10,2),
    platform_margin_percentage DECIMAL(5,2),
    rejection_reason TEXT,
    quality_grade VARCHAR(10),
    origin_location VARCHAR(255),
    production_method ENUM('CONVENTIONAL', 'ORGANIC', 'HYDROPONIC', 'PERMACULTURE'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(user_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (validated_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_availability_date (availability_date),
    INDEX idx_farmer_product (farmer_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des commandes
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    buyer_id BIGINT NOT NULL,
    offer_id BIGINT NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'IN_ESCROW', 'RELEASED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED', 'DISPUTED') DEFAULT 'PENDING',
    escrow_transaction_id VARCHAR(100),
    escrow_start_date DATETIME,
    escrow_end_date DATETIME,
    actual_delivery_date DATETIME,
    expected_delivery_date DATE,
    delivery_address TEXT,
    delivery_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by BIGINT,
    cancelled_at DATETIME,
    order_number VARCHAR(50) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyers(user_id),
    FOREIGN KEY (offer_id) REFERENCES offers(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_escrow_dates (escrow_start_date, escrow_end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des transactions
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    hedera_transaction_id VARCHAR(100) UNIQUE,
    type ENUM('TOKENIZATION', 'ESCROW_DEPOSIT', 'ESCROW_RELEASE', 'FARMER_PAYMENT', 'PLATFORM_FEE', 'STAKING_REWARD', 'REFUND') NOT NULL,
    amount DECIMAL(15,8) NOT NULL, -- Précision pour les cryptomonnaies
    currency ENUM('HBAR', 'USD') DEFAULT 'HBAR',
    from_account VARCHAR(50),
    to_account VARCHAR(50),
    smart_contract_address VARCHAR(100),
    gas_fee DECIMAL(10,8),
    consensus_timestamp TIMESTAMP(6), -- Timestamp Hedera avec microsecondes
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
    error_message TEXT,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_hedera_tx (hedera_transaction_id),
    INDEX idx_timestamp (consensus_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des notifications
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('ORDER_CREATED', 'ORDER_CONFIRMED', 'PAYMENT_RECEIVED', 'PAYMENT_RELEASED', 
              'DELIVERY_SCHEDULED', 'DELIVERY_COMPLETED', 'OFFER_VALIDATED', 'OFFER_REJECTED',
              'ESCROW_STARTED', 'ESCROW_ENDING_SOON', 'ESCROW_COMPLETED', 'SYSTEM_ANNOUNCEMENT') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    is_read BOOLEAN DEFAULT FALSE,
    delivery_channel ENUM('EMAIL', 'PUSH', 'SMS', 'IN_APP') NOT NULL,
    delivery_status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_type (type),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour le suivi logistique
CREATE TABLE deliveries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    carrier_name VARCHAR(255),
    tracking_number VARCHAR(100),
    pickup_date DATETIME,
    pickup_location TEXT,
    delivery_location TEXT,
    estimated_delivery_date DATETIME,
    actual_delivery_date DATETIME,
    delivery_status ENUM('SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED') DEFAULT 'SCHEDULED',
    delivery_proof_url VARCHAR(500),
    temperature_log JSON, -- Pour les produits nécessitant une chaîne du froid
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_status (delivery_status),
    INDEX idx_tracking (tracking_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les événements Hedera Consensus Service
CREATE TABLE hcs_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    topic_id VARCHAR(50) NOT NULL,
    sequence_number BIGINT NOT NULL,
    consensus_timestamp TIMESTAMP(6) NOT NULL,
    message_hash VARCHAR(128) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    event_data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_topic_sequence (topic_id, sequence_number),
    INDEX idx_event_type (event_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_consensus_timestamp (consensus_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour le staking et les rendements
CREATE TABLE staking_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    staked_amount DECIMAL(15,8) NOT NULL,
    staking_start_date DATETIME NOT NULL,
    staking_end_date DATETIME,
    expected_reward DECIMAL(10,8),
    actual_reward DECIMAL(10,8),
    reward_rate_percentage DECIMAL(5,2),
    status ENUM('ACTIVE', 'COMPLETED', 'WITHDRAWN') DEFAULT 'ACTIVE',
    node_id VARCHAR(50), -- Nœud Hedera pour le staking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_status (status),
    INDEX idx_dates (staking_start_date, staking_end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de configuration des prix et marges
CREATE TABLE pricing_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_category VARCHAR(100),
    min_margin_percentage DECIMAL(5,2) NOT NULL,
    max_margin_percentage DECIMAL(5,2) NOT NULL,
    default_margin_percentage DECIMAL(5,2) NOT NULL,
    transport_fee_per_km DECIMAL(10,2),
    handling_fee_percentage DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE NOT NULL,
    valid_until DATE,
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_category (product_category),
    INDEX idx_validity (valid_from, valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table d'audit pour la traçabilité
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vues utiles
CREATE VIEW active_offers_view AS
SELECT 
    o.id,
    o.quantity,
    o.final_price_for_buyer,
    o.availability_date,
    p.name as product_name,
    p.category,
    p.unit,
    u.first_name as farmer_first_name,
    u.last_name as farmer_last_name,
    f.farm_name,
    f.farm_location
FROM offers o
JOIN products p ON o.product_id = p.id
JOIN farmers f ON o.farmer_id = f.user_id
JOIN users u ON f.user_id = u.id
WHERE o.status = 'ACTIVE' 
  AND o.admin_validated = TRUE
  AND o.availability_date >= CURDATE();

-- Procédure stockée pour expirer les offres
DELIMITER //
CREATE PROCEDURE expire_old_offers()
BEGIN
    UPDATE offers 
    SET status = 'EXPIRED' 
    WHERE status = 'ACTIVE' 
      AND (expiry_date < CURDATE() OR availability_date < DATE_SUB(CURDATE(), INTERVAL 30 DAY));
END //
DELIMITER ;

-- Event scheduler pour exécuter la procédure quotidiennement
CREATE EVENT IF NOT EXISTS expire_offers_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO CALL expire_old_offers();

-- Indexes supplémentaires pour les performances
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX idx_offers_farmer_status ON offers(farmer_id, status);
CREATE INDEX idx_transactions_order_type ON transactions(order_id, type);