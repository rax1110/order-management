import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model.js';
import { CreateOrderDto, FilterOrdersDto, OrdersApiService } from './orders-api.service.js';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private ordersApiService: OrdersApiService) {}

  createOrder(orderData: CreateOrderDto): Observable<Order> {
    return this.ordersApiService.createOrder(orderData);
  }

  getOrders(filters: FilterOrdersDto = {}): Observable<Order[]> {
    return this.ordersApiService.getOrders(filters);
  }
} 