# Order Management Backend

NestJS-based backend application for the Order Management System.

## Features

- **RESTful API**: Endpoints for order management operations
- **Data Persistence**: TypeORM integration with PostgreSQL
- **Validation**: Request payload validation using class-validator
- **Filtering**: Filter orders by country and description
- **Unique ID Generation**: Human-readable, non-guessable IDs for orders
- **Documentation**: Swagger API documentation

## API Endpoints

Full documentation: http://127.0.0.1:3000/docs

### Orders

- `GET /orders` - Get all orders with optional filtering
- `POST /orders` - Create a new order

## Future Improvements

- Implement caching for frequently accessed data
- Add rate limiting for API endpoints
- Implement full-text search for description field
- Add webhook notifications for order status changes
- Implement authentication and authorization
- Implement pagination for order listings
- Integrate with currency exchange APIs
- Add support for translation/internationalization
- Generate Open API specifications for frontend codegen
- Implement proper linter configuration
- Set up CI/CD pipeline for migrations, tests, with precommit hooks for lint and branch checks
- Fix interceptors to handle errors appropriately