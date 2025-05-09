import { CountryCode } from '../features/orders/models/country.model.js';
import { CurrencyCode } from '../features/orders/models/currency.model.js';
import { Order } from '../features/orders/models/order.model.js';

export const mockCountries = [
  { code: CountryCode.Estonia, name: 'Estonia' },
  { code: CountryCode.USA, name: 'USA' },
  { code: CountryCode.France, name: 'France' }
];

export const mockCurrencies = [
  { code: CurrencyCode.EUR, name: 'Euro' },
  { code: CurrencyCode.USD, name: 'US Dollar' }
];

export function createMockOrder(partial: Partial<Order> = {}): Order {
  const now = new Date();
  
  return {
    id: 1,
    orderNumber: 'ORD-001',
    paymentDescription: 'Test Order',
    streetAddress: '123 Test St',
    town: 'Test Town',
    amount: 100,
    currencyCode: CurrencyCode.EUR,
    countryCode: CountryCode.Estonia,
    paymentDueDate: now,
    createdAt: now,
    updatedAt: now,
    ...partial
  };
}

export function createMockOrders(): Order[] {
  return [
    createMockOrder({
      id: 1, 
      orderNumber: 'ORD-001',
      paymentDescription: 'Test Order 1'
    }),
    createMockOrder({
      id: 2, 
      orderNumber: 'ORD-002',
      paymentDescription: 'Test Order 2',
      amount: 200
    })
  ];
} 