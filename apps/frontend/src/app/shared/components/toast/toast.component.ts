import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service.js';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  readonly toasts;

  constructor(private toastService: ToastService) {
    this.toasts = this.toastService.toasts;
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
} 