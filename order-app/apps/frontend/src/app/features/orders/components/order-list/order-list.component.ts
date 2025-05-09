import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component.js';
import { BadgeType, StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component.js';
import { Country, CountryCode } from '../../models/country.model.js';
import { Order } from '../../models/order.model.js';
import { CountryBadgeTypePipe } from '../../pipes/country-badge-type.pipe.js';
import { CountryNamePipe } from '../../pipes/country-name.pipe.js';
import { PaymentStatus, PaymentStatusPipe } from '../../pipes/payment-status.pipe.js';
import { StatusBadgeTypePipe } from '../../pipes/status-badge-type.pipe.js';
import { CountriesService } from '../../services/countries.service.js';
import { FilterOrdersDto } from '../../services/orders-api.service.js';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    LoadingSpinnerComponent,
    StatusBadgeComponent,
    PaymentStatusPipe,
    StatusBadgeTypePipe,
    CountryBadgeTypePipe,
    CountryNamePipe,
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  @Input() orders: Order[] | null = [];
  @Input() loading: boolean | null = false;
  @Input() filters: FilterOrdersDto = {
    countryCode: '',
    description: ''
  };

  @Output() filterChange = new EventEmitter<{ field: keyof FilterOrdersDto, value: string }>();
  @Output() clearFilters = new EventEmitter<void>();

  countries$!: Observable<Country[]>;
  readonly countryCode = CountryCode;
  readonly badgeType = BadgeType;
  readonly paymentStatus = PaymentStatus;

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.countries$ = this.countriesService.getCountries();
  }

  updateFilter(field: keyof FilterOrdersDto, value: string): void {
    this.filterChange.emit({ field, value });
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
} 