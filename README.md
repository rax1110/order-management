# Order Management Application

This project is built as an NX monorepo containing two main applications:

- **Frontend**: Angular application for order creation and viewing
- **Backend**: NestJS API for order management and persistence

The application allows you to create and view orders with filtering capabilities.

### Key Features

- Create orders with validation (no duplicate order numbers)
- View orders with filtering capabilities (by country and description)
- Custom sorting (Estonia first, then by payment due date)
- Human-readable and non-guessable unique IDs for orders

### Development Notes

For simplicity in this technical assessment, configuration is hardcoded without `.env` files. In a production environment, proper environment variables would be implemented following security best practices, with different configurations for development, staging, and production environments. Also database modeling is simplified and not normalized, ideally the Order entity could be split into Address, Payment (depending on business needs).

## Documentation

- [Frontend Documentation](./apps/frontend/README.md)
- [Backend Documentation](./apps/backend/README.md)

## Quick Setup

### Prerequisites

- Node.js (v22)
- npm or yarn
- Docker and Docker Compose (for database)

### Complete Application Setup

```bash
# Start PostgreSQL database with Docker
docker-compose up -d

# Install dependencies
npm install

# Generate migrations (if needed)
npm run migration:generate

# Run database migrations
npm run migration:run

# Start all applications together
npm run start

# Start backend development server
npm run start:backend

# In another terminal, start frontend development server
npm run start:frontend
```

Visit `http://localhost:4200` to access the application.

### All-in-One Setup Script

You can create a shell script to boot everything together:

```bash
# Create a file named start-app.sh
echo '#!/bin/bash
docker-compose up -d
npm install
npm run migration:run
npm run start:backend & 
npm run start:frontend
' > start-app.sh

# Make it executable
chmod +x start-app.sh

# Run it
./start-app.sh
```

## Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run backend e2e tests
npm test:backend-e2e
```

## Technology Stack

- **Frontend**: Angular, TypeScript, RxJS
- **Backend**: NestJS, TypeORM, TypeScript
- **Database**: PostgreSQL
- **Monorepo**: NX
- **Containerization**: Docker

## Production Readiness

The application includes several features to make it production-ready:

- **Traceability**: Comprehensive logging system
- **Quality Assurance**: Unit and integration tests
- **API Documentation**: Swagger documentation
- **Error Handling**: Global exception filters
- **Data Validation**: DTO validation

## Areas for Improvement

- Authentication and authorization
- Pagination support for lists
- Normalization of data
- CI/CD pipeline setup
- Comprehensive test coverage
- Performance optimizations for large datasets
- Complete Dockerization for easier deployment (frontend and backend)
- Monitoring and alerting system
- Form validation improvements with clear error states
- Debounce functionality for search operations
- Preserve form state with clear functionality
- Google Places API integration for address lookup and form prefill
- Currency exchange API integration
- Translations and internationalization (i18n)
- Reusable UI component library
- Proper linter configuration setup
- CI/CD pipeline for migrations, tests, deployment, with precommit hooks for lint and branch checks
- Open API codegen for types
