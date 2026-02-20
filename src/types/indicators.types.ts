/**
 * TypeScript types for economic indicators from Trading Economics API.
 */

/**
 * Represents a single economic indicator for a country.
 * Maps the structure returned by the Trading Economics API.
 */
export interface Indicator {
  /** Country name */
  Country: string;
  /** Indicator category (e.g., "GDP", "Inflation") */
  Category: string;
  /** Human-readable indicator title */
  Title: string;
  /** Latest recorded value */
  LatestValue: number | null;
  /** Date of the latest value in ISO format */
  LatestValueDate: string | null;
  /** Source of the data (e.g., "World Bank") */
  Source: string;
  /** Measurement unit (e.g., "USD Billion", "Percent") */
  Unit: string;
  /** URL to detailed indicator page on Trading Economics */
  URL: string;
  /** Top-level grouping category (e.g., "GDP", "Labour") */
  CategoryGroup: string;
  /** Frequency of data updates (e.g., "yearly", "quarterly") */
  Frequency: string;
  /** Symbol/identifier used for historical data lookups */
  HistoricalDataSymbol: string;
  /** Indicator creation date */
  CreateDate: string;
  /** Previous recorded value */
  PreviousValue: number | null;
  /** Previous value date */
  PreviousValueDate: string | null;
}
