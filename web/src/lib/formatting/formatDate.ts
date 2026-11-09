const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });

/** Formats an ISO 8601 timestamp as an en-GB date such as "8 July 2025" in the viewer's time zone. */
export function formatDate(timestamp: string): string {
  return DATE_FORMAT.format(new Date(timestamp));
}
