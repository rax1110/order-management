import { Pipe, PipeTransform } from '@angular/core';
import { BadgeType } from '../../../shared/components/status-badge/status-badge.component.js';
import { PaymentStatus } from './payment-status.pipe.js';

@Pipe({
  name: 'statusBadgeType',
  standalone: true,
  pure: true
})
export class StatusBadgeTypePipe implements PipeTransform {
  transform(status: PaymentStatus): BadgeType {
    switch (status) {
      case PaymentStatus.Overdue:
        return BadgeType.Warning;
      case PaymentStatus.DueSoon:
        return BadgeType.Pending;
      default:
        return BadgeType.Success;
    }
  }
} 