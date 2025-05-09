import { CountryCode } from "./country.model.js";
import { CurrencyCode } from "./currency.model.js";

export interface Order {
  id: number;
  orderNumber: string;
  paymentDescription: string;
  streetAddress: string;
  town: string;
  countryCode: CountryCode;
  amount: number;
  currencyCode: CurrencyCode;
  paymentDueDate: Date;
  createdAt: Date;
  updatedAt: Date;
} 