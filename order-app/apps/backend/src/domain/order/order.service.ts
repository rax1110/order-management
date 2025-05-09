import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CountryCode } from '../../common/constants';
import { IdGenerator } from '../../common/utils/id-generator.util';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const existingOrder = await this.ordersRepository.findOne({
      where: { orderNumber: createOrderDto.orderNumber },
    });

    if (existingOrder) {
      throw new ConflictException('Order number already exists');
    }

    const order = this.ordersRepository.create({
      ...createOrderDto,
      uniqueId: await IdGenerator.generateUniqueId(),
      paymentDueDate: new Date(createOrderDto.paymentDueDate),
    });

    await this.ordersRepository.save(order);
    
    return plainToInstance(OrderResponseDto, order);
  }

  async findAll(filterDto: FilterOrdersDto): Promise<OrderResponseDto[]> {
    const { countryCode, description } = filterDto;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    const preferredCountryCodes = [CountryCode.ESTONIA];
    
    if (countryCode) {
      queryBuilder.andWhere('order.countryCode = :countryCode', { countryCode: countryCode });
    }

    if (description) {
      // ILIKE search that will utilize trigram index for better performance
      queryBuilder.andWhere('order.payment_description ILIKE :pattern', { 
        pattern: `%${description}%` 
      });
    }
  
    queryBuilder.orderBy(`
      CASE 
        WHEN order.countryCode = :code1 THEN 0 
        ELSE 1 
      END`, 'ASC')
      .setParameter('code1', preferredCountryCodes[0])
      .addOrderBy('order.paymentDueDate', 'ASC');
    
    const orders = await queryBuilder.getMany();

    return orders.map(order => plainToInstance(OrderResponseDto, order));
  }
} 