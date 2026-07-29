import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';

/**
 * Retrieves the scroll container for the current page. Depending on the PWA mode this can be
 * a scrollable article element or the window.
 * @returns The scroll container element, or null if it could not be found.
 */
export const getScrollContainer = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(`.route__${PAGE_PREVIEW_PATTERN.replace(/^\/+/, '')}`);

/**
 * Parameters for {@link checkScheduled}.
 */
export interface ScheduledParams {
  /**
   * The start date of the scheduling in ISO format.
   */
  from?: string;
  /**
   * The end date of the scheduling in ISO format.
   */
  to?: string;
  /**
   * The timezone offset in minutes. If not provided, the local timezone offset will be used.
   */
  timezoneOffset?: number;
}

/**
 * The scheduling status of a widget.
 */
export interface ScheduledStatus {
  /**
   * Indicates if the widget is scheduled.
   */
  isScheduled: boolean;
  /**
   * Indicates if the widget is currently active within the scheduled time frame.
   */
  isActive: boolean;
  /**
   * Indicates if the scheduled time frame has expired.
   */
  isExpired: boolean;
}

/**
 * Retrieves the scheduling status of a widget based on the provided parameters.
 * @param params The parameters for the function.
 * @param params.from The start date of the scheduling in ISO format.
 * @param params.to The end date of the scheduling in ISO format.
 * @param params.timezoneOffset The timezone offset in minutes.
 * @returns An object containing the scheduling status.
 */
export function checkScheduled(
  { from, to, timezoneOffset }: ScheduledParams = {}
): ScheduledStatus {
  const now = new Date();

  // Convert current time to provided or local timezone
  const localOffset = timezoneOffset ?? -now.getTimezoneOffset(); // in minutes
  const offsetMs = localOffset * 60 * 1000;
  const localNow = new Date(now.getTime() + offsetMs);

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const isActive = (!fromDate || localNow >= new Date(fromDate.getTime() + offsetMs)) &&
                      (!toDate || localNow <= new Date(toDate.getTime() + offsetMs));

  const isExpired = !!toDate && localNow > new Date(toDate.getTime() + offsetMs);
  const isScheduled = !!fromDate || !!toDate;
  return {
    isScheduled,
    isActive,
    isExpired,
  };
}
