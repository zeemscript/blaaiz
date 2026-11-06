export type DestinationId = "NGN" | "GBP" | "KES" | "GHS" | "USD";

export type Destination = {
  id: DestinationId;
  country: string;
  label: string;
  flag: string;
  currencyCode: string;
  method: "bank_transfer" | "mobile_money" | "ach";
  bankCountry?: string;
};

export const destinations: Destination[] = [
  {
    id: "NGN",
    country: "Nigeria",
    label: "Nigeria · Bank transfer",
    flag: "🇳🇬",
    currencyCode: "NGN",
    method: "bank_transfer",
    bankCountry: "NG",
  },
  {
    id: "GBP",
    country: "United Kingdom",
    label: "United Kingdom · Bank transfer",
    flag: "🇬🇧",
    currencyCode: "GBP",
    method: "bank_transfer",
    bankCountry: "GB",
  },
  {
    id: "KES",
    country: "Kenya",
    label: "Kenya · Mobile money",
    flag: "🇰🇪",
    currencyCode: "KES",
    method: "mobile_money",
  },
  {
    id: "GHS",
    country: "Ghana",
    label: "Ghana · Mobile money",
    flag: "🇬🇭",
    currencyCode: "GHS",
    method: "mobile_money",
  },
  {
    id: "USD",
    country: "United States",
    label: "United States · ACH",
    flag: "🇺🇸",
    currencyCode: "USD",
    method: "ach",
  },
];

export const fundingAssets = [
  { code: "USD", label: "USD", flag: "💵", kind: "fiat" as const },
  { code: "USDT", label: "USDT", flag: "🟢", kind: "crypto" as const },
  { code: "USDC", label: "USDC", flag: "🔵", kind: "crypto" as const },
];

export const cryptoNetworkFallback = [
  { id: "ETHEREUM_MAINNET", label: "Ethereum" },
  { id: "BSC_MAINNET", label: "BNB Smart Chain" },
  { id: "TRON_MAINNET", label: "Tron" },
  { id: "MATIC_MAINNET", label: "Polygon" },
];
