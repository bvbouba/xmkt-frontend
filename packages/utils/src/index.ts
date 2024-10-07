import {DEFAULT_LOCALE} from "myconstants"

export const formatAsMoney = (amount = 0, currency = "USD", locale = DEFAULT_LOCALE) =>
  new Intl.NumberFormat(locale, 
  ).format(amount);

  export const formatPrice = (price?: number) =>
  formatAsMoney(price || 0);

export function uppercase(string:string) {
  return string.toUpperCase();
}

export function lowercase(string:string) {
  return string.toLowerCase();
}

export function decodeBase64(encodedString:string) {
  return atob(encodedString);
}