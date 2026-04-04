/**
 * Format a number as a currency string using the built-in Intl.NumberFormat API.
 *
 * @param amount   - The numeric price (e.g. 499)
 * @param currency - ISO 4217 currency code (e.g. "USD", "EUR", "INR")
 * @param locale   - Optional BCP 47 locale tag (e.g. "en-US", "en-IN")
 * @returns Formatted string like "$9.99" or "₹499.00"
 *
 * @example
 * formatCurrency(499, "INR")  → "₹499.00"
 * formatCurrency(9.99, "USD") → "$9.99"
 * formatCurrency(9.99, "EUR") → "9,99 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const resolvedLocale = locale ?? getDefaultLocale(currency);

  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Compact format for large numbers (e.g. "$1.2K" instead of "$1,200.00")
 * Useful for summary/insight cards.
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const resolvedLocale = locale ?? getDefaultLocale(currency);

  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format subscription price with billing period suffix.
 * e.g. "₹499.00/month"
 */
export function formatSubscriptionPrice(
  amount: number,
  billing: string,
  currency: string = "USD"
): string {
  const price = formatCurrency(amount, currency);
  return `${price}/${billing}`;
}

/** Map common currency codes to sensible default locales */
function getDefaultLocale(currency: string): string {
  const map: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    INR: "en-IN",
    JPY: "ja-JP",
    CAD: "en-CA",
    AUD: "en-AU",
    SGD: "en-SG",
    AED: "ar-AE",
    BRL: "pt-BR",
    CNY: "zh-CN",
    KRW: "ko-KR",
  };
  return map[currency] ?? "en-US";
}

/** List of supported currencies for dropdown/picker */
export const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];
