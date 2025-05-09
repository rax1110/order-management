import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { CountriesApiService } from './countries-api.service.js';
import { Country } from '../models/country.model.js';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private countries$: Observable<Country[]>;
  
  constructor(private countriesApiService: CountriesApiService) {
    this.countries$ = this.countriesApiService.getCountries().pipe(
      shareReplay(1)
    );
  }

  getCountries(): Observable<Country[]> {
    return this.countries$;
  }
} 