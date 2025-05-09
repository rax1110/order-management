import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../models/country.model.js';

@Pipe({
  name: 'countryName',
  standalone: true,
  pure: true
})
export class CountryNamePipe implements PipeTransform {
  transform(countryCode: string, countries: Country[] | null): string {
    if (!countryCode || !countries) {
      return '';
    }
    
    const country = countries.find(c => c.code === countryCode);
    
    return country ? country.name : countryCode;
  }
} 