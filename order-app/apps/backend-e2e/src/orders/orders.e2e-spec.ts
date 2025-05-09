import request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../../backend/src/domain/order/entities/order.entity';
import { CountryCode, CurrencyCode } from '../../../backend/src/common/constants';
import { setupTestApp } from '../support/test-utils';

describe('OrderController (e2e)', () => {
  let app: NestFastifyApplication;
  let orderRepository: Repository<Order>;
  
  beforeAll(async () => {
    app = await setupTestApp();
    orderRepository = app.get<Repository<Order>>(getRepositoryToken(Order));
  }, 30000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  afterEach(async () => {
    await orderRepository.clear();
  });

  describe('/orders (POST)', () => {
    const createOrderDto = {
      orderNumber: 'ORDER123',
      paymentDescription: 'Test Payment',
      streetAddress: '123 Test St',
      town: 'Test Town',
      countryCode: CountryCode.ESTONIA,
      amount: 100,
      currencyCode: CurrencyCode.EUR,
      paymentDueDate: '2023-12-31',
    };

    it('should create a new order successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .send(createOrderDto)
        .expect(201);
        
      // Check that required properties exist
      expect(response.body.id).toBeDefined();
      expect(response.body.orderNumber).toBe(createOrderDto.orderNumber);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      
      // Excluded fields
      expect(response.body.uniqueId).toBeUndefined();
      
      // Check data is correctly transformed
      expect(response.body.paymentDescription).toBe(createOrderDto.paymentDescription);
      expect(response.body.streetAddress).toBe(createOrderDto.streetAddress);
      expect(response.body.town).toBe(createOrderDto.town);
      expect(response.body.countryCode).toBe(createOrderDto.countryCode);
      expect(response.body.amount).toBe(createOrderDto.amount);
      expect(response.body.currencyCode).toBe(createOrderDto.currencyCode);
    }, 10000);

    it('should return 409 conflict when order number already exists', async () => {
      // First create an order
      await request(app.getHttpServer())
        .post('/api/orders')
        .send(createOrderDto)
        .expect(201);

      // Attempt to create the same order again
      return request(app.getHttpServer())
        .post('/api/orders')
        .send(createOrderDto)
        .expect(409);
    }, 10000);

    it('should return 400 bad request when validation fails', async () => {
      const invalidOrder = {
        // Missing required fields
        orderNumber: 'ORDER123',
        paymentDescription: 'Test Payment',
        // streetAddress is missing
        town: 'Test Town',
        // Invalid country code
        countryCode: 'INVALID',
        amount: -100, // Negative amount
        currencyCode: CurrencyCode.EUR,
        paymentDueDate: '2023-12-31',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);
    }, 10000);
  });

  describe('/orders (GET)', () => {
    // Setup test data
    const testOrders = [
      {
        orderNumber: 'ORDER1',
        paymentDescription: 'Estonian Payment',
        streetAddress: '123 Estonian St',
        town: 'Tallinn',
        countryCode: CountryCode.ESTONIA,
        amount: 100,
        currencyCode: CurrencyCode.EUR,
        paymentDueDate: '2023-12-01T10:00:00.000Z',
      },
      {
        orderNumber: 'ORDER2',
        paymentDescription: 'USA Payment',
        streetAddress: '456 American Ave',
        town: 'New York',
        countryCode: CountryCode.USA,
        amount: 200,
        currencyCode: CurrencyCode.USD,
        paymentDueDate: '2023-12-15T10:00:00.000Z',
      },
      {
        orderNumber: 'ORDER3',
        paymentDescription: 'UK Special Payment',
        streetAddress: '789 British Rd',
        town: 'London',
        countryCode: CountryCode.UK,
        amount: 150,
        currencyCode: CurrencyCode.GBP,
        paymentDueDate: '2023-12-31T10:00:00.000Z',
      },
    ];

    beforeEach(async () => {
      // Create test orders before each test
      for (const order of testOrders) {
        await request(app.getHttpServer())
          .post('/api/orders')
          .send(order)
          .expect(201);
      }
    });

    it('should return all orders when no filters are provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(testOrders.length);
      
      // Check that the response contains all test orders
      for (const testOrder of testOrders) {
        const found = response.body.some(
          (order: any) => order.orderNumber === testOrder.orderNumber
        );
        expect(found).toBe(true);
      }
    }, 10000);

    it('should filter orders by country code', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders?countryCode=EE')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].countryCode).toBe(CountryCode.ESTONIA);
    }, 10000);

    it('should filter orders by description', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders?description=Special')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].paymentDescription).toContain('Special');
    }, 10000);

    it('should filter orders by both country code and description', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders?countryCode=GB&description=Special')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].countryCode).toBe(CountryCode.UK);
      expect(response.body[0].paymentDescription).toContain('Special');
    }, 10000);

    it('should return empty array when no orders match the filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/orders?countryCode=DE&description=Nonexistent')
        .expect(200);
        
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    }, 10000);
  });
}); 