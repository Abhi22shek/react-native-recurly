import dayjs from "dayjs";
 

export function formateCurrency(amount: number, currency: string, locale?: string): string {
    const resolvedLocale = locale ?? getDefaultLocale(currency);

    return new Intl.NumberFormat(resolvedLocale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

function getDefaultLocale(currency: string): string {
    const map: Record<string, string> = {
        USD: "en-US",
        EUR: "de-DE",
        GBP: "en-GB",
        INR: "en-IN",
        JPY: "ja-JP",
        CAD: "en-CA",
        AUD: "en-AU",
    };
    return map[currency] ?? "en-US";
}
export const formatSubscriptionDateTime = (value?: string): string => {
    if (!value) return "Not provided";
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
};
