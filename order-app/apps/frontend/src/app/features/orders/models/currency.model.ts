export interface Currency {
    code: string;
    name: string;
}

export enum CurrencyCode {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP'
}

export const Currencies: Currency[] = [
    { code: CurrencyCode.EUR, name: 'EUR' },
    { code: CurrencyCode.USD, name: 'USD' },
    { code: CurrencyCode.GBP, name: 'GBP' }
];


  