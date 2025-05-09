import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { CountryCode, CurrencyCode } from '../../../common/constants';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'The order number' })
  orderNumber!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: 'The payment description' })  
  paymentDescription!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: 'The street address' })
  streetAddress!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'The town' })
  town!: string;

  @IsNotEmpty()
  @IsEnum(CountryCode)
  @ApiProperty({ description: 'The country code (ISO 3166-1 alpha-2 code)', enum: CountryCode })
  countryCode!: CountryCode;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Max(9999999.99)
  @ApiProperty({ 
    description: 'Order amount (maximum 9,999,999.99)',
    example: 99.99
  })
  amount!: number;

  @IsNotEmpty()
  @IsEnum(CurrencyCode)
  @ApiProperty({ description: 'The currency code (ISO 4217 code)', enum: CurrencyCode })
  currencyCode!: CurrencyCode;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'The payment due date' })
  paymentDueDate!: string;
} 