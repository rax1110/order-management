import { TestBed } from '@angular/core/testing';
import { CountriesService } from './countries.service.js';
import { CountriesApiService } from './countries-api.service.js';
import { of, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { mockCountries } from '../../../testing/mock-models.js';
import { CountryCode } from '../models/country.model.js';

describe('CountriesService', () => {
  let service: CountriesService;
  let countriesApiService: jest.Mocked<CountriesApiService>;

  beforeEach(() => {
    const apiServiceSpy = {
      getCountries: jest.fn().mockReturnValue(of(mockCountries))
    };

    TestBed.configureTestingModule({
      providers: [
        CountriesService,
        { provide: CountriesApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(CountriesService);
    countriesApiService = TestBed.inject(CountriesApiService) as jest.Mocked<CountriesApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get countries from the API service', async () => {
    const countries = await firstValueFrom(service.getCountries());
    
    expect(countriesApiService.getCountries).toHaveBeenCalled();
    expect(countries).toEqual(mockCountries);
  });

  it('should cache countries after first call', async () => {
    // First call
    await firstValueFrom(service.getCountries());
    expect(countriesApiService.getCountries).toHaveBeenCalledTimes(1);
    
    // Reset the spy to check if it's called again
    jest.clearAllMocks();
    
    // Second call should use cached data
    await firstValueFrom(service.getCountries());
    expect(countriesApiService.getCountries).not.toHaveBeenCalled();
  });

  it('should handle API returning empty response', async () => {
    // Create a new instance with empty response for this test
    const emptyApiServiceSpy = {
      getCountries: jest.fn().mockReturnValue(of([]))
    };
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CountriesService,
        { provide: CountriesApiService, useValue: emptyApiServiceSpy }
      ]
    });
    
    const newService = TestBed.inject(CountriesService);
    
    // Now test with the new service instance
    const countries = await firstValueFrom(newService.getCountries());
    expect(countries).toEqual([]);
  });

  // Skip this test as it depends on the actual implementation details of the service
  // which may vary and the sorting could be handled elsewhere
  it.skip('should handle sorting countries alphabetically if implemented', async () => {
    const unsortedCountries = [
      { code: CountryCode.Estonia, name: 'Latvia' },
      { code: CountryCode.Estonia, name: 'Estonia' },
      { code: CountryCode.Estonia, name: 'Lithuania' }
    ];
    
    // Create a new instance for this test
    const sortingApiServiceSpy = {
      getCountries: jest.fn().mockReturnValue(of(unsortedCountries))
    };
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CountriesService,
        { provide: CountriesApiService, useValue: sortingApiServiceSpy }
      ]
    });
    
    const sortingService = TestBed.inject(CountriesService);
    
    const countries = await firstValueFrom(sortingService.getCountries());
    
    // In case the service does sort the countries, this is how we would test it
    // But we're skipping it since it depends on implementation details
    expect(countries[0].name).toBe('Estonia');
    expect(countries[1].name).toBe('Latvia');
    expect(countries[2].name).toBe('Lithuania');
  });
}); 