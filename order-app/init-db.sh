#!/bin/bash

# Initialize PostgreSQL database for the order management app
PGPASSWORD=postgres psql -U postgres -h localhost <<EOF
CREATE DATABASE orders_db;
\c orders_db;

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

GRANT ALL PRIVILEGES ON DATABASE orders_db TO postgres;
\q
EOF

echo "Database 'orders_db' created successfully!" 