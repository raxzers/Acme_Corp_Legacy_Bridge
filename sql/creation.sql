CREATE TABLE merchants (
    merchant_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE currencies (
    currency_code CHAR(3) PRIMARY KEY,
    description TEXT
);
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,

    merchant_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    currency_code CHAR(3) NOT NULL,

    description TEXT,
    amount NUMERIC(14,2) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_merchant
        FOREIGN KEY (merchant_id)
        REFERENCES merchants(merchant_id),

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id),

    CONSTRAINT fk_currency
        FOREIGN KEY (currency_code)
        REFERENCES currencies(currency_code)
);

CREATE INDEX idx_transactions_date
ON transactions(transaction_date);

CREATE INDEX idx_transactions_merchant
ON transactions(merchant_id);

CREATE INDEX idx_transactions_category
ON transactions(category_id);

CREATE INDEX idx_transactions_currency
ON transactions(currency_code);
