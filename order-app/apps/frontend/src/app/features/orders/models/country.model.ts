export interface Country {
    code: string;
    name: string;
}

export enum CountryCode {
    Estonia = 'EE',
    USA = 'US',
    UK = 'GB',
    Germany = 'DE',
    France = 'FR',
    Italy = 'IT',
    Spain = 'ES',
    Finland = 'FI',
    Sweden = 'SE',
    Norway = 'NO',
}
  
export const Countries: Country[] = [
    { code: CountryCode.Estonia, name: 'Estonia' },
    { code: CountryCode.USA, name: 'USA' },
    { code: CountryCode.UK, name: 'UK' },
    { code: CountryCode.Germany, name: 'Germany' },
    { code: CountryCode.France, name: 'France' },
    { code: CountryCode.Italy, name: 'Italy' },
    { code: CountryCode.Spain, name: 'Spain' },
    { code: CountryCode.Finland, name: 'Finland' },
    { code: CountryCode.Sweden, name: 'Sweden' },
    { code: CountryCode.Norway, name: 'Norway' }
];