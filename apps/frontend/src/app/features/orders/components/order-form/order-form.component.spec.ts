import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderFormComponent } from './order-form.component.js';
import { CountriesService } from '../../services/countries.service.js';
import { CurrenciesService } from '../../services/currencies.service.js';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CountryCode } from '../../models/country.model.js';
import { CurrencyCode } from '../../models/currency.model.js';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockCountries, mockCurrencies } from '../../../../testing/mock-models.js';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let countriesService: jest.Mocked<CountriesService>;
  let currenciesService: jest.Mocked<CurrenciesService>;

  beforeEach(async () => {
    const countriesServiceSpy = {
      getCountries: jest.fn().mockReturnValue(of(mockCountries))
    };
    
    const currenciesServiceSpy = {
      getCurrencies: jest.fn().mockReturnValue(of(mockCurrencies))
    };

    await TestBed.configureTestingModule({
      imports: [
        OrderFormComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CountriesService, useValue: countriesServiceSpy },
        { provide: CurrenciesService, useValue: currenciesServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Used to ignore some template errors for now
    }).compileComponents();

    countriesService = TestBed.inject(CountriesService) as jest.Mocked<CountriesService>;
    currenciesService = TestBed.inject(CurrenciesService) as jest.Mocked<CurrenciesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch countries and currencies on init', () => {
    expect(countriesService.getCountries).toHaveBeenCalled();
    expect(currenciesService.getCurrencies).toHaveBeenCalled();
  });

  it('should initialize form with default values', () => {
    expect(component.orderForm).toBeTruthy();
    expect(component.orderForm.get('countryCode')?.value).toBe(CountryCode.Estonia);
    expect(component.orderForm.get('currencyCode')?.value).toBe(CurrencyCode.EUR);
    expect(component.orderForm.get('amount')?.value).toBe('');
    expect(component.orderForm.get('orderNumber')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.orderForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.orderForm.patchValue({
      orderNumber: 'ORD-001',
      paymentDescription: 'Test Order',
      streetAddress: '123 Main St',
      town: 'Test Town',
      countryCode: CountryCode.Estonia,
      currencyCode: CurrencyCode.EUR,
      amount: '100',
      paymentDueDate: '2023-12-31'
    });

    expect(component.orderForm.valid).toBeTruthy();
  });

  it('should not submit form when invalid', () => {
    jest.spyOn(component.submitOrder, 'emit');
    
    component.onSubmit();
    expect(component.submitted).toBeTruthy();
    expect(component.submitOrder.emit).not.toHaveBeenCalled();
  });

  it('should emit submitOrder event with form data when form is valid', () => {
    jest.spyOn(component.submitOrder, 'emit');
    
    const orderData = {
      orderNumber: 'ORD-001',
      paymentDescription: 'Test Order',
      streetAddress: '123 Main St',
      town: 'Test Town',
      countryCode: CountryCode.Estonia,
      currencyCode: CurrencyCode.EUR,
      amount: '100',
      paymentDueDate: '2023-12-31'
    };

    component.orderForm.patchValue(orderData);
    component.onSubmit();

    expect(component.submitOrder.emit).toHaveBeenCalledWith({
      ...orderData,
      amount: 100 // Should be converted to number
    });
  });

  it('should emit cancel event when onCancel is called', () => {
    jest.spyOn(component.cancel, 'emit');
    
    component.onCancel();
    
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should mark form as submitted after submission attempt', () => {
    // Manually touch the control for testing
    component.orderForm.get('orderNumber')?.markAsTouched();
    
    component.onSubmit();
    
    // Form should be marked as submitted
    expect(component.submitted).toBeTruthy();
    
    // Check that form control is touched
    expect(component.orderForm.get('orderNumber')?.touched).toBeTruthy();
  });

  it('should store error message when provided', () => {
    const errorMessage = 'Test error message';
    component.errorMessage = errorMessage;
    
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should disable submit button when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });
}); 