import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.js';
import { Countries, Country } from '../models/country.model.js';

@Injectable({
  providedIn: 'root'
})
export class CountriesApiService {
  private apiUrl = `${environment.apiUrl}/countries`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch countries from the API
   * 
   * In a real application, this would connect to an actual API endpoint.
   * For now, we're returning static data to simulate the API call.
   */
  getCountries(): Observable<Country[]> {
    return of(Countries).pipe(
      catchError(error => {
        console.error('Error fetching countries:', error);
        return of([]);
      })
    );
  }
} 