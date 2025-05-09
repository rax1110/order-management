import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ButtonComponent } from '../../../../shared/components/button/button.component.js';
import { OrderListComponent } from '../../components/order-list/order-list.component.js';
import { Order } from '../../models/order.model.js';
import { FilterOrdersDto } from '../../services/orders-api.service.js';
import { OrdersService } from '../../services/orders.service.js';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    OrderListComponent,
    ButtonComponent,
  ],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private filtersSubject = new BehaviorSubject<FilterOrdersDto>({
    countryCode: '',
    description: ''
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  filters: FilterOrdersDto = {
    countryCode: '',
    description: ''
  };
  
  orders$!: Observable<Order[]>;
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initOrdersStream();
    this.setupRouterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initOrdersStream(): void {
    this.orders$ = this.filtersSubject.pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap(filters => {
        const cleanFilters: FilterOrdersDto = {};

        if (filters.countryCode?.trim()) {
          cleanFilters.countryCode = filters.countryCode.trim();
        }

        if (filters.description?.trim()) {
          cleanFilters.description = filters.description.trim();
        }

        return this.ordersService.getOrders(cleanFilters);
      }),
      tap(() => this.loadingSubject.next(false)),
      takeUntil(this.destroy$)
    );
  }

  private setupRouterListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.url === '/orders'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.clearFilters();
    });
  }

  updateFilter(field: keyof FilterOrdersDto, value: string): void {
    this.filters = {
      ...this.filters,
      [field]: value
    };

    this.filtersSubject.next(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      countryCode: '',
      description: ''
    };
    
    this.filtersSubject.next(this.filters);
  }

  navigateToOrderDetails(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }
} 