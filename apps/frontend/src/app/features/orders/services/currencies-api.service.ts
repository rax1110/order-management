import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.js';
import { Currencies, Currency } from '../models/currency.model.js';


@Injectable({
  providedIn: 'root'
})
export class CurrenciesApiService {
  private apiUrl = `${environment.apiUrl}/currencies`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch currencies from the API
   * 
   * In a real application, this would connect to an actual API endpoint.
   * For now, we're returning static data to simulate the API call.
   */
  getCurrencies(): Observable<Currency[]> {
    return of(Currencies).pipe(
      catchError(error => {
        console.error('Error fetching currencies:', error);
        return of([]);
      })
    );
  }
} 