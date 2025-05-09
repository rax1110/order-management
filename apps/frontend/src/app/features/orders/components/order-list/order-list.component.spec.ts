import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component.js';
import { CountriesService } from '../../services/countries.service.js';
import { of } from 'rxjs';
import { CountryCode } from '../../models/country.model.js';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterOrdersDto } from '../../services/orders-api.service.js';
import { createMockOrders, mockCountries } from '../../../../testing/mock-models.js';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let countriesService: jest.Mocked<CountriesService>;
  let mockOrders = createMockOrders();

  beforeEach(async () => {
    const countriesServiceSpy = {
      getCountries: jest.fn().mockReturnValue(of(mockCountries))
    };

    await TestBed.configureTestingModule({
      imports: [
        OrderListComponent,
      ],
      providers: [
        { provide: CountriesService, useValue: countriesServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Used selectively to ignore some template errors for now
    }).compileComponents();

    countriesService = TestBed.inject(CountriesService) as jest.Mocked<CountriesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    component.orders = mockOrders;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch countries on init', () => {
    expect(countriesService.getCountries).toHaveBeenCalled();
  });

  it('should set orders properly', () => {
    expect(component.orders).toBeDefined();
    expect(component.orders).toEqual(mockOrders);
    expect(component.orders?.length).toBe(mockOrders.length);
  });

  it('should initially not show loading spinner', () => {
    expect(component.loading).toBeFalsy();
  });

  it('should set loading property correctly', () => {
    component.loading = true;
    fixture.detectChanges();
    
    expect(component.loading).toBeTruthy();
  });

  it('should emit filterChange when updateFilter is called', () => {
    jest.spyOn(component.filterChange, 'emit');
    
    const field: keyof FilterOrdersDto = 'countryCode';
    const value = CountryCode.Estonia;
    
    component.updateFilter(field, value);
    
    expect(component.filterChange.emit).toHaveBeenCalledWith({ field, value });
  });

  it('should emit clearFilters when onClearFilters is called', () => {
    jest.spyOn(component.clearFilters, 'emit');
    
    component.onClearFilters();
    
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });

  it('should handle country filter changes', () => {
    jest.spyOn(component.filterChange, 'emit');
    jest.spyOn(component, 'updateFilter');
    
    // Simulate the component's updateFilter method directly
    component.updateFilter('countryCode', CountryCode.Estonia);
    
    expect(component.updateFilter).toHaveBeenCalledWith('countryCode', CountryCode.Estonia);
    expect(component.filterChange.emit).toHaveBeenCalledWith({ 
      field: 'countryCode', 
      value: CountryCode.Estonia 
    });
  });

  it('should handle description filter updates', () => {
    jest.spyOn(component.filterChange, 'emit');
    jest.spyOn(component, 'updateFilter');
    
    // Simulate the component's updateFilter method directly
    component.updateFilter('description', 'Test Order');
    
    expect(component.updateFilter).toHaveBeenCalledWith('description', 'Test Order');
    expect(component.filterChange.emit).toHaveBeenCalledWith({ 
      field: 'description', 
      value: 'Test Order' 
    });
  });
}); 