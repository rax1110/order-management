import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { CountryCode, CurrencyCode } from '../../common/constants';
import { ConflictException } from '@nestjs/common';
import { OrderResponseDto } from './dto/order-response.dto';
import { IdGenerator } from '../../common/utils/id-generator.util';

jest.mock('../../common/utils/id-generator.util', () => ({
  IdGenerator: {
    generateUniqueId: jest.fn().mockResolvedValue('TEST_UNIQUE_ID'),
  },
}));

type MockRepository<T = any> = Partial<Record<keyof Repository<Order>, jest.Mock>>;

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: MockRepository<Order>;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    orderRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      orderNumber: 'ORDER123',
      paymentDescription: 'Test Payment',
      streetAddress: '123 Test St',
      town: 'Test Town',
      countryCode: CountryCode.ESTONIA,
      amount: 100,
      currencyCode: CurrencyCode.EUR,
      paymentDueDate: '2023-12-31',
    };

    const expectedOrder = {
      ...createOrderDto,
      uniqueId: 'TEST_UNIQUE_ID',
      paymentDueDate: new Date('2023-12-31'),
    };

    it('should create a new order successfully', async () => {
      (orderRepository.findOne as jest.Mock).mockResolvedValue(null);
      (orderRepository.create as jest.Mock).mockReturnValue(expectedOrder);
      (orderRepository.save as jest.Mock).mockResolvedValue(expectedOrder);

      const result = await service.create(createOrderDto);

      expect(IdGenerator.generateUniqueId).toHaveBeenCalled();
      
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { orderNumber: createOrderDto.orderNumber },
      });
      expect(orderRepository.create).toHaveBeenCalledWith({
        ...createOrderDto,
        uniqueId: 'TEST_UNIQUE_ID',
        paymentDueDate: new Date(createOrderDto.paymentDueDate),
      });
      expect(orderRepository.save).toHaveBeenCalledWith(expectedOrder);
      
      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(result).toEqual(expect.objectContaining({
        orderNumber: createOrderDto.orderNumber,
      }));
    });

    it('should throw a ConflictException when order number already exists', async () => {
      (orderRepository.findOne as jest.Mock).mockResolvedValue({ orderNumber: 'ORDER123' });

      await expect(service.create(createOrderDto)).rejects.toThrow(ConflictException);

      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { orderNumber: createOrderDto.orderNumber },
      });
      expect(orderRepository.create).not.toHaveBeenCalled();
      expect(orderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORDER123',
        uniqueId: 'ABCDEFGHIJ',
        paymentDescription: 'Test Payment 1',
        streetAddress: '123 Test St',
        town: 'Test Town',
        countryCode: CountryCode.ESTONIA,
        amount: 100,
        currencyCode: CurrencyCode.EUR,
        paymentDueDate: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        orderNumber: 'ORDER456',
        uniqueId: 'KLMNOPQRST',
        paymentDescription: 'Test Payment 2',
        streetAddress: '456 Test Ave',
        town: 'Another Town',
        countryCode: CountryCode.USA,
        amount: 200,
        currencyCode: CurrencyCode.USD,
        paymentDueDate: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all orders when no filters are provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockOrders);

      const result = await service.findAll({});

      expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalled();
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('code1', CountryCode.ESTONIA);
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('order.paymentDueDate', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
      expect(result[1]).toBeInstanceOf(OrderResponseDto);
    });

    it('should filter orders by country code', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockOrders[0]]);

      const filterDto: FilterOrdersDto = { countryCode: CountryCode.ESTONIA };
      const result = await service.findAll(filterDto);

      expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.countryCode = :countryCode',
        { countryCode: CountryCode.ESTONIA }
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
      expect(result[0].countryCode).toBe(CountryCode.ESTONIA);
    });

    it('should filter orders by description', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockOrders[1]]);

      const filterDto: FilterOrdersDto = { description: 'Payment 2' };
      const result = await service.findAll(filterDto);

      expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.payment_description ILIKE :pattern',
        { pattern: '%Payment 2%' }
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
    });

    it('should filter orders by both country code and description', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockOrders[0]]);

      const filterDto: FilterOrdersDto = { 
        countryCode: CountryCode.ESTONIA, 
        description: 'Payment 1' 
      };
      const result = await service.findAll(filterDto);

      expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.countryCode = :countryCode',
        { countryCode: CountryCode.ESTONIA }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'order.payment_description ILIKE :pattern',
        { pattern: '%Payment 1%' }
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
    });

    it('should return empty array when no orders match the filter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const filterDto: FilterOrdersDto = { 
        countryCode: CountryCode.GERMANY,
        description: 'Nonexistent' 
      };
      const result = await service.findAll(filterDto);

      expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      expect(result).toHaveLength(0);
    });
  });
}); 