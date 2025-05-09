import { Route } from '@angular/router';
import { OrdersPageComponent } from './features/orders/pages/orders-page/orders-page.component.js';
import { OrderFormPageComponent } from './features/orders/pages/order-form-page/order-form-page.component.js';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'orders/new', component: OrderFormPageComponent },
  { path: '**', redirectTo: 'orders' }
];
