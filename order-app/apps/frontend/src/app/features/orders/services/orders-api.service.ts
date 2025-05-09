import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model.js';
import { environment } from '../../../../environments/environment.js';

export interface CreateOrderDto {
  orderNumber: string;
  paymentDescription: string;
  streetAddress: string;
  town: string;
  countryCode: string;
  amount: number;
  currencyCode: string;
  paymentDueDate: string;
}

export interface FilterOrdersDto {
  countryCode?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getOrders(filters: FilterOrdersDto = {}): Observable<Order[]> {
    const cleanFilters = Object.entries(filters)
      .filter(([_, value]) => Boolean(value))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
    const params = new HttpParams({ fromObject: cleanFilters });
    
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
} 