import { Pipe, PipeTransform } from '@angular/core';
import { BadgeType } from '../../../shared/components/status-badge/status-badge.component.js';
import { CountryCode } from '../models/country.model.js';

@Pipe({
  name: 'countryBadgeType',
  standalone: true,
  pure: true
})
export class CountryBadgeTypePipe implements PipeTransform {
  transform(countryCode: string): BadgeType {
    return countryCode === CountryCode.Estonia ? BadgeType.Primary : BadgeType.Normal;
  }
} 