import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class OrderResponseDto {
    @ApiProperty({ description: 'Order ID' })
    id!: number;

    @ApiProperty({ description: 'Order number (unique reference)' })
    orderNumber!: string;

    @ApiProperty({ description: 'Unique ID' })
    @Exclude()
    uniqueId!: string;

    @ApiProperty({ description: 'Description of the payment' })
    paymentDescription!: string;

    @ApiProperty({ description: 'Street address for delivery' })
    streetAddress!: string;

    @ApiProperty({ description: 'Town or city' })
    town!: string;

    @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-2)', example: 'EE' })
    countryCode!: string;

    @ApiProperty({ description: 'Amount to be paid', example: 99.99 })
    amount!: number;

    @ApiProperty({ description: 'Currency code (ISO 4217)', example: 'EUR' })
    currencyCode!: string;

    @ApiProperty({ description: 'Payment due date', example: '2025-05-08T00:00:00.000Z' })
    paymentDueDate!: Date;
  }