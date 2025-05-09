import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Currency } from '../models/currency.model.js';
import { CurrenciesApiService } from './currencies-api.service.js';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  // cache the currencies request to avoid multiple API calls
  private currencies$: Observable<Currency[]>;
  
  constructor(private currenciesApiService: CurrenciesApiService) {
    this.currencies$ = this.currenciesApiService.getCurrencies().pipe(
      shareReplay(1)
    );
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies$;
  }
} 