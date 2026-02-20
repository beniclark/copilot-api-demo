/**
 * Raw indicator shape returned by the Trading Economics API.
 * Uses PascalCase keys matching the upstream response.
 */
export interface TradingEconomicsIndicator {
  Country: string;
  Category: string;
  Title: string;
  LatestValueDate: string;
  LatestValue: number;
  Source: string;
  SourceURL: string;
  Unit: string;
  URL: string;
  CategoryGroup: string;
  Adjustment: string;
  Frequency: string;
  HistoricalDataSymbol: string;
  CreateDate: string;
  FirstValueDate: string;
  PreviousValue: number;
  PreviousValueDate: string;
}

/**
 * Normalized indicator shape used internally by our API.
 * Uses camelCase keys following project conventions.
 */
export interface Indicator {
  country: string;
  category: string;
  title: string;
  latestValueDate: string;
  latestValue: number;
  source: string;
  sourceUrl: string;
  unit: string;
  url: string;
  categoryGroup: string;
  adjustment: string;
  frequency: string;
  historicalDataSymbol: string;
  createDate: string;
  firstValueDate: string;
  previousValue: number;
  previousValueDate: string;
}
