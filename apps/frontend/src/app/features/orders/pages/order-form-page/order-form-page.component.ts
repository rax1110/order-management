import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { ErrorHandlerService } from '../../../../core/services/error-handler.service.js';
import { ToastService } from '../../../../core/services/toast.service.js';
import { OrderFormComponent } from '../../components/order-form/order-form.component.js';
import { CreateOrderDto } from '../../services/orders-api.service.js';
import { OrdersService } from '../../services/orders.service.js';
import { ButtonComponent } from '../../../../shared/components/button/button.component.js';

@Component({
  selector: 'app-order-form-page',
  standalone: true,
  imports: [
    CommonModule,
    OrderFormComponent,
    ButtonComponent
  ],
  templateUrl: './order-form-page.component.html',
  styleUrls: ['./order-form-page.component.scss']
})
export class OrderFormPageComponent implements OnDestroy {
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmitOrder(orderData: CreateOrderDto): void {
    this.loading = true;
    this.errorMessage = '';

    this.errorHandler.skipNextErrorNotification();
    this.ordersService.createOrder(orderData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Order created successfully');
          this.router.navigate(['/orders']);
        },
        error: (error: unknown) => this.handleError(error)
      });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }

  private handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 409) {
      this.errorMessage = 'Order number already exists';
      return;
    }

    if (error instanceof HttpErrorResponse && error.error?.message) {
      if (Array.isArray(error.error.message)) {
        this.errorMessage = error.error.message[0];
      } else if (typeof error.error.message === 'string') {
        this.errorMessage = error.error.message;
      } else if (error.error.message.message && Array.isArray(error.error.message.message)) {
        this.errorMessage = error.error.message.message[0];
      }
    } else {
      this.errorMessage = 'Please check your form and try again.';
    }
  }
} 