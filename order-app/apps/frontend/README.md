# Order Management Frontend

Angular-based frontend application for the Order Management System.

## Features

- **Order Creation Form**: Add new orders with validation
  - Required fields: order number, payment description, street address, town, country, amount, currency, payment due date
  - Form validation including prevention of duplicate order numbers
  
- **Orders List View**: View all orders with filtering and sorting
  - Filter by country
  - Filter by description (text search)
  - Custom sorting (Estonia first, then by payment due date ascending)
  
- **Responsive Design**: Works on desktop and mobile devices

## Future Improvements

- Implement advanced filtering options
- Add order details view
- Include pagination for large datasets
- Support for multiple languages/i18n
- Enhanced form validation with clear error states on form elements
- Preserve form state with clear functionality
- Debounce functionality for search operations
- Google Places API integration for automatic address lookup and form prefill
- Currency exchange API integration
- Improved mobile responsive design
- Translations and internationalization support
- Build a reusable UI component library
- Implement proper linter configuration and setup
- Use Open API codegen for type safety between frontend and backend 