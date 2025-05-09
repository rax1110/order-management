import { TestBed } from '@angular/core/testing';
import { OrdersService } from './orders.service.js';
import { OrdersApiService, FilterOrdersDto, CreateOrderDto } from './orders-api.service.js';
import { of, throwError } from 'rxjs';
import { Order } from '../models/order.model.js';
import { CountryCode } from '../models/country.model.js';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CurrencyCode } from '../models/currency.model.js';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersApiService: jest.Mocked<OrdersApiService>;
  let mockOrders: Order[];

  beforeEach(() => {
    mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        paymentDescription: 'Test Order 1',
        streetAddress: '123 Test St',
        town: 'Test Town',
        amount: 100,
        currencyCode: CurrencyCode.EUR,
        countryCode: CountryCode.Estonia,
        paymentDueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        paymentDescription: 'Test Order 2',
        streetAddress: '456 Test Ave',
        town: 'Test City',
        amount: 200,
        currencyCode: CurrencyCode.EUR,
        countryCode: CountryCode.USA,
        paymentDueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const apiServiceSpy = {
      getOrders: jest.fn().mockReturnValue(of(mockOrders)),
      createOrder: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(OrdersService);
    ordersApiService = TestBed.inject(OrdersApiService) as jest.Mocked<OrdersApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve orders with filters', async () => {
    const filters: FilterOrdersDto = {
      countryCode: CountryCode.Estonia,
      description: 'Test'
    };

    ordersApiService.getOrders.mockReturnValueOnce(of([mockOrders[0]]));
    
    const result = await firstValueFrom(service.getOrders(filters));
    
    expect(ordersApiService.getOrders).toHaveBeenCalledWith(filters);
    expect(result).toEqual([mockOrders[0]]);
  });

  it('should retrieve all orders when no filters are provided', async () => {
    const result = await firstValueFrom(service.getOrders());
    
    expect(ordersApiService.getOrders).toHaveBeenCalledWith({});
    expect(result).toEqual(mockOrders);
  });

  it('should create an order successfully', async () => {
    const dueDate = new Date('2023-12-31');
    const dueDateStr = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const newOrder: CreateOrderDto = {
      orderNumber: 'ORD-003',
      paymentDescription: 'New Test Order',
      streetAddress: '123 Test St',
      town: 'Test Town',
      countryCode: CountryCode.Estonia,
      currencyCode: CurrencyCode.EUR,
      amount: 300,
      paymentDueDate: dueDateStr
    };

    const createdOrder: Order = {
      id: 3,
      orderNumber: newOrder.orderNumber,
      paymentDescription: newOrder.paymentDescription,
      streetAddress: newOrder.streetAddress,
      town: newOrder.town,
      countryCode: CountryCode.Estonia,
      currencyCode: CurrencyCode.EUR,
      amount: newOrder.amount,
      paymentDueDate: dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    ordersApiService.createOrder.mockReturnValueOnce(of(createdOrder));
    
    const result = await firstValueFrom(service.createOrder(newOrder));
    
    expect(ordersApiService.createOrder).toHaveBeenCalledWith(newOrder);
    expect(result).toEqual(createdOrder);
  });

  it('should handle error when creating an order', async () => {
    const dueDate = new Date('2023-12-31');
    const dueDateStr = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const newOrder: CreateOrderDto = {
      orderNumber: 'ORD-003',
      paymentDescription: 'New Test Order',
      streetAddress: '123 Test St',
      town: 'Test Town',
      countryCode: CountryCode.Estonia,
      currencyCode: CurrencyCode.EUR,
      amount: 300,
      paymentDueDate: dueDateStr
    };

    const errorResponse = new HttpErrorResponse({
      error: 'Order already exists',
      status: 400,
      statusText: 'Bad Request'
    });

    ordersApiService.createOrder.mockReturnValueOnce(throwError(() => errorResponse));
    
    await expect(firstValueFrom(service.createOrder(newOrder))).rejects.toBe(errorResponse);
  });

  it('should handle empty order list', async () => {
    ordersApiService.getOrders.mockReturnValueOnce(of([]));
    
    const result = await firstValueFrom(service.getOrders());
    
    expect(result).toEqual([]);
  });
}); 