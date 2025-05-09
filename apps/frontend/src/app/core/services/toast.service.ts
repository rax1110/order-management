import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  originalError?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  showSuccess(message: string, duration = 3000): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      message,
      duration
    });
  }

  showError(message: string, duration = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      message,
      duration
    });
  }

  showInfo(message: string, duration = 3000): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      message,
      duration
    });
  }

  showWarning(message: string, duration = 4000): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      message,
      duration
    });
  }

  remove(id: string): void {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  private show(toast: Toast): void {
    this._toasts.update(toasts => [...toasts, toast]);

    if (toast.duration) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
} 