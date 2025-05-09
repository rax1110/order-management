import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/order.model.js';

export enum PaymentStatus {
  Overdue = 'Overdue',
  DueSoon = 'Due Soon',
  OnTime = 'On Time'
}

@Pipe({
  name: 'paymentStatus',
  standalone: true,
  pure: true
})
export class PaymentStatusPipe implements PipeTransform {
  transform(order: Order): PaymentStatus {
    const dueDate = new Date(order.paymentDueDate);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return PaymentStatus.Overdue;
    } else if (daysDiff <= 3) {
      return PaymentStatus.DueSoon;
    } else {
      return PaymentStatus.OnTime;
    }
  }
} 