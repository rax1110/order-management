import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum BadgeType {
  Primary = 'primary',
  Normal = 'normal',
  Success = 'success',
  Warning = 'warning',
  Pending = 'pending'
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() type: BadgeType = BadgeType.Normal;
  @Input() text: string = '';
  
  badgeType = BadgeType;
} 