import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component.js';

export type ButtonVariant = 'primary' | 'secondary' | 'link';
export type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() routerLink: string | null = null;
  @Input() text: string | null = null; // Couldn't get link tag <a> to work with ng-content

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  get classes(): string[] {
    const baseClass = 'app-button';
    const classes = [baseClass];
    
    if (this.variant) {
      classes.push(`${baseClass}--${this.variant}`);
    }
    
    if (this.fullWidth) {
      classes.push(`${baseClass}--full-width`);
    }
    
    if (this.loading) {
      classes.push(`${baseClass}--loading`);
    }
    
    return classes;
  }
} 