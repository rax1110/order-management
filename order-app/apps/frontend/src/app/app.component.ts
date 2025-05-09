import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component.js';

@Component({
  standalone: true,
  imports: [RouterModule, ToastComponent],
  templateUrl: './app.component.html',
  selector: 'order-app-root',
})

export class AppComponent {
  title = 'Order Management System';
}
