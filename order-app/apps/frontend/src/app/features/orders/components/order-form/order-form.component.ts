import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component.js';
import { Country, CountryCode } from '../../models/country.model.js';
import { Currency, CurrencyCode } from '../../models/currency.model.js';
import { CountriesService } from '../../services/countries.service.js';
import { CurrenciesService } from '../../services/currencies.service.js';
import { CreateOrderDto } from '../../services/orders-api.service.js';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})

export class OrderFormComponent implements OnInit {
  @Input() loading = false;
  @Input() errorMessage = '';
  
  @Output() submitOrder = new EventEmitter<CreateOrderDto>();
  @Output() cancel = new EventEmitter<void>();

  orderForm: FormGroup;
  submitted = false;

  countries$!: Observable<Country[]>;
  currencies$!: Observable<Currency[]>;
  
  readonly currencyCode = CurrencyCode;
  readonly countryCode = CountryCode;

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private currenciesService: CurrenciesService
  ) {
    this.orderForm = this.initForm();
  }

  ngOnInit(): void {
    this.countries$ = this.countriesService.getCountries();
    this.currencies$ = this.currenciesService.getCurrencies();
  }

  get formControls() { 
    return this.orderForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.orderForm.invalid) {
      return;
    }

    const orderData: CreateOrderDto = {
      ...this.orderForm.value,
      amount: parseFloat(this.orderForm.value.amount)
    };

    this.submitOrder.emit(orderData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private initForm(): FormGroup {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    return this.formBuilder.group({
      orderNumber: ['', Validators.required],
      paymentDescription: ['', Validators.required],
      streetAddress: ['', Validators.required],
      town: ['', Validators.required],
      countryCode: [CountryCode.Estonia, Validators.required],
      currencyCode: [CurrencyCode.EUR, Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentDueDate: [formattedDate, Validators.required]
    });
  }
} 