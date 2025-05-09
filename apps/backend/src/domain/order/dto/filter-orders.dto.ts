import { IsOptional, IsString } from 'class-validator';
import { CountryCode } from '../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class FilterOrdersDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The country code (ISO 3166-1 alpha-2 code)' })
  countryCode?: CountryCode;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The payment description' })
  description?: string;
} 