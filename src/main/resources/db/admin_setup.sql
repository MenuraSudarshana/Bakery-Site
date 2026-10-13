USE bakery_db;

CREATE TABLE IF NOT EXISTS product_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL,
    flavour VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(800) NOT NULL,
    price DOUBLE NOT NULL,
    rating DOUBLE NOT NULL DEFAULT 4.5,
    stock INT NOT NULL DEFAULT 0,
    active BIT(1) NOT NULL DEFAULT b'1',
    created_at VARCHAR(80) NOT NULL,
    updated_at VARCHAR(80) NOT NULL
);

ALTER TABLE customer_order
    MODIFY COLUMN order_items LONGTEXT NOT NULL;

ALTER TABLE customer_order
    MODIFY COLUMN payment_method VARCHAR(50) NOT NULL;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

SET @active_col_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'customer_login'
      AND column_name = 'active'
);
SET @active_col_sql = IF(
    @active_col_exists = 0,
    'ALTER TABLE customer_login ADD COLUMN active BIT(1) NOT NULL DEFAULT b''1''',
    'SELECT 1'
);
PREPARE active_col_stmt FROM @active_col_sql;
EXECUTE active_col_stmt;
DEALLOCATE PREPARE active_col_stmt;

DROP TABLE IF EXISTS daily_stock_entry;
DROP TABLE IF EXISTS stock_movement;
DROP TABLE IF EXISTS monthly_financial_summary;
DROP TABLE IF EXISTS expense_entry;

CREATE TABLE IF NOT EXISTS contact_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    message VARCHAR(1500) NOT NULL,
    submitted_at VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS customize_cake_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    occasion VARCHAR(120) NOT NULL,
    weight VARCHAR(80) NOT NULL,
    design_photo_url VARCHAR(1000) NULL,
    contact_number VARCHAR(20) NOT NULL,
    required_date VARCHAR(20) NOT NULL,
    payment_method VARCHAR(40) NOT NULL,
    layers INT NOT NULL,
    flavor VARCHAR(150) NULL,
    specifications VARCHAR(2000) NULL,
    note VARCHAR(2000) NULL,
    order_status VARCHAR(40) NOT NULL,
    created_at VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    review_text VARCHAR(1500) NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    dislikes_count INT NOT NULL DEFAULT 0,
    hidden_by_admin BIT(1) NOT NULL DEFAULT b'0',
    auto_hidden BIT(1) NOT NULL DEFAULT b'0',
    created_at VARCHAR(40) NOT NULL,
    updated_at VARCHAR(40) NOT NULL
);

INSERT INTO user (username, password)
SELECT 'admin', 'admin123'
WHERE NOT EXISTS (
    SELECT 1 FROM user WHERE username = 'admin'
);
