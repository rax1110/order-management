# Order Management Application

This is a small order management application built using NestJS for the backend and Angular for the frontend. The application allows you to create and view orders with filtering capabilities.

## Features

- Create orders with validation
- View orders with sorting (Estonia first, then by payment due date)
- Filter orders by country and description
- Unique, human-readable IDs for each order

## Tech Stack

- NX monorepo for managing the frontend and backend applications
- NestJS as the backend framework
- TypeORM for database communication
- Angular for the frontend
- PostgreSQL for the database
- TailwindCSS for styling

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Docker and Docker Compose (for running PostgreSQL)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the required configuration.

### 3. Start the backend

```bash
npx nx serve backend
```

The backend will be available at http://localhost:3000/api

### 4. Start the frontend

```bash
npx nx serve frontend
```

The frontend will be available at http://localhost:4200

## API Endpoints

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders with optional filtering
  - Query parameters:
    - `country` - Filter by country
    - `description` - Filter by payment description
- `GET /api/orders/:id` - Get a specific order by ID

## Project Structure

- `apps/backend` - NestJS backend application
  - `src/app/orders` - Orders module, controller, service, and entities
- `apps/frontend` - Angular frontend application
  - `src/app/components` - Angular components
  - `src/app/services` - Angular services for API communication
  - `src/app/models` - TypeScript interfaces/models

## Development

### Running tests

```bash
# Run backend tests
npx nx test backend

# Run frontend tests
npx nx test frontend
```

### Building for production

```bash
# Build both applications
npx nx build

# Build individual applications
npx nx build backend
npx nx build frontend
```

## Environment Configuration

The application can be configured using environment variables:

### Backend

- `PORT` - The port the backend will run on (default: 3000)
- `DATABASE_HOST` - PostgreSQL host (default: localhost)
- `DATABASE_PORT` - PostgreSQL port (default: 5432)
- `DATABASE_USER` - PostgreSQL username (default: postgres)
- `DATABASE_PASSWORD` - PostgreSQL password (default: postgres)
- `DATABASE_NAME` - PostgreSQL database name (default: orders_db)
- `NODE_ENV` - Node environment (development, production, etc.)

## Deployment

The frontend and backend can be deployed separately or together. The application includes Docker configuration for easy containerization.

For a production deployment, you should:

1. Build both applications for production
2. Configure appropriate environment variables
3. Set up a production PostgreSQL database
4. Deploy the applications to your hosting provider

## License

This project is licensed under the MIT License.
