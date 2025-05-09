import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The order has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with optional filtering' })
  @ApiQuery({ 
    name: 'country', 
    required: false,
    type: String,
    description: 'Filter by country' 
  })
  @ApiQuery({ 
    name: 'description', 
    required: false, 
    type: String,
    description: 'Filter by description',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all orders matching the filter criteria.'
  })
  findAll(@Query() filterDto: FilterOrdersDto): Promise<OrderResponseDto[]> {
    return this.orderService.findAll(filterDto);
  }
}