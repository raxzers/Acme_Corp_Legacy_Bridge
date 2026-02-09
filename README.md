# Transaction Processing & Classification Engine
## Overview

This project processes transaction data coming from a legacy XML source with inconsistent formatting.
The system performs:

- Data normalization (dates, currencies, descriptions)

- Rule-based transaction classification

- Currency conversion with configurable exchange rates

- Aggregation and category-based analytics

- Storage in a normalized PostgreSQL schema

- The primary goal is to transform unreliable legacy financial feeds into structured, queryable, and analytics-ready data.

### Key features:

- XML data normalization (dates → ISO 8601, currency → numeric values)

- Configurable rule engine for transaction categorization

- Currency conversion support

- Category filtering and aggregated totals

- Normalized relational database schema

- Error handling for unreliable legacy API responses

## Architecture

### Main components:
| Layer| Technology | Responsibility|
| ---------------- | ------ | ---- |
|Presentation|	HTML + JavaScript	|UI filtering, totals, currency selection|
|Processing	|JavaScript	|XML parsing, normalization, classification|
|Storage	|PostgreSQL	|Normalized transaction persistence|
|Rules Engine	|Configurable JS logic	|Category classification|
|Currency Engine|	Configurable rules	|Exchange rate conversion|

## Running the Project Locally
### 1. Clone Repository

```bash

git clone (https://github.com/raxzers/Acme_Corp_Legacy_Bridge.git
cd Acme_Corp_Legacy_Bridge
```

### 2. Requirements

- Modern browser

- PostgreSQL 14+

- Local web server (examples):

    - Python http.server

    - VSCode Live Server

    - nginx or Apache

### 3. Setup Database

```
psql -U postgres -d yourdb -f sql/creation.sql
```

### 4. Configure Environment

Edit configuration files:

- Database credentials

- Exchange rate rules

- Category rules

### 5. Run Frontend

#### Example with Python:

```
python -m http.server 8080
```

Open:

```
http://localhost:8080
```

#### Example  with Live Server

1. Right-click index.html

2. Select Open with Live Server

3. Browser will open automatically

Example URL:
```
http://127.0.0.1:5500
```

## Database Schema Explanation

The schema is normalized to reduce redundancy and maintain data integrity.

### Core Entities

#### Merchants

Stores merchant information independent of transactions.

- id (PK)

- name

- category_default

#### Transactions

Represents individual financial events.

- id (PK)

- merchant_id (FK)

- amount

- currency

- transaction_date

- description

#### Categories

Defines classification groups.

- id (PK)

- name

#### ExchangeRates

Stores conversion rules.

- from_currency

- to_currency

- rate

- updated_at

### Design Rationale

- Avoids duplication of merchant names across transactions

- Enables flexible rule-based classification

- Supports currency normalization and conversion

- Facilitates analytics and reporting queries

### Data Normalization
#### Dates

Supported formats converted to ISO 8601:

- YYYY-MM-DD

- MM/DD/YYYY

- MMM DD, YYYY

#### Currency

- Removes symbols ($, €)

- Converts to numeric

- Optional exchange rate application


## Error Logging Strategy for Legacy API Issues

Because the legacy API may return malformed or inconsistent data:

1. Validation Layer

    - XML schema validation

    - Required field checks

    - Currency format verification

    - Date parsing validation

2. Structured Logging

     Log fields:

    - raw_record

    - error_type

    - parsing_stage

    - timestamp

    - validation_context

3. Error Categories

    - Invalid Date Format

    - Unsupported Currency

    - Missing Merchant

    - Malformed XML

    - Rule Engine Failures

    - Conversion Rule Missing

4. Handling Strategy

    - Reject critical failures

    - Mark partial records as needs_review

    - Store raw payload for debugging

    - Maintain audit table for ingestion errors

5. Observability Improvements (Optional Future Work)

    - Centralized logging (ELK / Loki)

    - Metrics dashboard

    - Error rate alerts

    - Alerting on ingestion error rates

    - Audit table for rejected records

6. Security Considerations

    - Input sanitization during XML parsing

    - Strict type validation

    - Separation of processing and presentation layers

    - Database constraints and foreign keys

    - Immutable transaction records

7. Future Enhancements

    - Backend API (Node.js / Express or Java Spring)

    - Automated exchange rate ingestion

    - Machine-learning classification

    - Batch ingestion pipeline

    - Streaming ingestion support

    - Role-based access control

    - Transaction anomaly detection
