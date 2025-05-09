import { Column, Entity } from 'typeorm';
import { CountryCode, CurrencyCode } from '../../../common/constants';
import { BaseEntity } from '../../../common/entities/base-entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ unique: true, type: 'varchar', name: 'order_number' })
  orderNumber!: string;

  @Column({ unique: true, type: 'varchar', name: 'unique_id' })
  uniqueId!: string;

  @Column({ type: 'text', name: 'payment_description' })
  paymentDescription!: string;

  @Column({ type: 'varchar', name: 'street_address' })
  streetAddress!: string;

  @Column({ type: 'varchar' })
  town!: string;

  @Column({ type: 'varchar', length: 2, name: 'country_code' })
  countryCode!: CountryCode;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, name: 'currency_code' })
  currencyCode!: CurrencyCode;

  @Column({ type: 'timestamp', name: 'payment_due_date' })
  paymentDueDate!: Date;
}