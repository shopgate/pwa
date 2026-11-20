import { useEffect, useState } from 'react';
import { useWidget } from '@shopgate/engage/page/hooks';
import type { WidgetButtonAlignment } from '../../components/WidgetButton';
import type { HeadlineProps } from '../../components/WidgetHeadline/WidgetHeadline';

/** How the remaining time is shown: one tile per unit or one line of text. */
export type CountdownDisplay = 'boxed' | 'inline';

/** What the widget does once the end date has passed. */
export type CountdownAfterExpiry = 'hide' | 'showText';

/** A color picked in the admin. */
export interface CountdownColor {
  /** The CSS color. */
  value?: string;
}

/**
 * Configuration of the Countdown widget.
 */
export interface CountdownWidgetConfig {
  /** The end of the countdown as an ISO date string. */
  endDate?: string;
  /** How the remaining time is shown. */
  display?: CountdownDisplay;
  /** Whether the headline is shown. */
  showHeadline?: boolean;
  /** The headline above the countdown. */
  headline?: HeadlineProps;
  /** Rich text below the countdown. */
  text?: string;
  /** Text of the button that opens the link. */
  buttonText?: string;
  /** The link the button opens. */
  link?: string;
  /** Where the button sits. */
  buttonAlignment?: WidgetButtonAlignment;
  /** Background color of the widget area. */
  backgroundColor?: CountdownColor | null;
  /** Text color of the widget area. */
  textColor?: CountdownColor | null;
  /** What the widget does after the end. */
  afterExpiry?: CountdownAfterExpiry;
  /** Rich text shown instead of countdown, text and button after the end. */
  expiredText?: string;
}

/** The remaining time split into its units. */
export interface RemainingTime {
  /** Full days. */
  days: number;
  /** Hours of the started day. */
  hours: number;
  /** Minutes of the started hour. */
  minutes: number;
  /** Seconds of the started minute. */
  seconds: number;
}

/**
 * Splits a number of seconds into days, hours, minutes and seconds.
 * @param total The seconds.
 * @returns The remaining time.
 */
export const splitSeconds = (total: number): RemainingTime => ({
  days: Math.floor(total / 86400),
  hours: Math.floor((total % 86400) / 3600),
  minutes: Math.floor((total % 3600) / 60),
  seconds: total % 60,
});

/**
 * Calculates the seconds until an end time.
 * @param endTime The end as a timestamp in milliseconds.
 * @returns The seconds until the end, at least 0.
 */
const getRemainingSeconds = (endTime: number) => (
  Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
);

/**
 * Counts the seconds down to an end date, once per second, and stops at 0.
 * @param endDate The end as an ISO date string.
 * @returns The remaining seconds, or null without a valid end date.
 */
export const useRemainingSeconds = (endDate?: string): number | null => {
  const endTime = Date.parse(endDate ?? '');
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(endTime));

  useEffect(() => {
    if (Number.isNaN(endTime)) return undefined;

    setRemaining(getRemainingSeconds(endTime));

    const interval = setInterval(() => {
      const next = getRemainingSeconds(endTime);
      setRemaining(next);

      if (next === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return Number.isNaN(endTime) ? null : remaining;
};

/**
 * Hook to access the Countdown widget configuration.
 * @returns The configuration with its defaults.
 */
export const useCountdownWidget = () => {
  const { config } = useWidget<CountdownWidgetConfig>();

  return {
    ...config,
    display: config.display ?? 'boxed',
    buttonAlignment: config.buttonAlignment ?? 'center',
    afterExpiry: config.afterExpiry ?? 'hide',
    backgroundColor: config.backgroundColor?.value || undefined,
    textColor: config.textColor?.value || undefined,
  };
};
