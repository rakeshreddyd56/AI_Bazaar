export type CurrencyCode = "USD" | "INR" | "EUR";

const ratesFromUsd: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.1,
  EUR: 0.92,
};

const symbols: Record<CurrencyCode, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
};

const locales: Record<CurrencyCode, string> = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "de-DE",
};

export const resolveCurrency = (value?: string): CurrencyCode => {
  if (value === "INR" || value === "EUR") return value;
  return "USD";
};

export const currencySymbol = (currency: CurrencyCode) => symbols[currency];

export const convertFromUsd = (
  value: number | undefined,
  currency: CurrencyCode,
): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value * ratesFromUsd[currency];
};

export const formatCurrencyValue = (
  valueUsd: number | undefined,
  currency: CurrencyCode,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
) => {
  const converted = convertFromUsd(valueUsd, currency);
  if (typeof converted !== "number") return "-";

  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(converted);
};

export const pricingLineFromUsd = (
  pricing:
    | {
        inputPerM?: number;
        outputPerM?: number;
        monthly?: number;
      }
    | undefined,
  currency: CurrencyCode,
) => {
  if (!pricing) return "Pricing varies";

  if (typeof pricing.monthly === "number") {
    return `~${formatCurrencyValue(pricing.monthly, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}/mo`;
  }

  const input = formatCurrencyValue(pricing.inputPerM, currency);
  const output = formatCurrencyValue(pricing.outputPerM, currency);

  if (input === "-" && output === "-") return "Pricing varies";
  return `${input}/${output} per 1M`;
};
