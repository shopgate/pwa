import { componentsConfig } from '@shopgate/pwa-common/helpers/config';
import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';
import { type MediaMarginSettings } from '@shopgate/engage/settings/types/appSettings';
import {
  type AppliedMediaMargins,
  type WidgetConfig,
  type WidgetDefinitionLayout,
  type WidgetLayout,
} from './types';
import { MARGIN_SIDES, MARGIN_SIDE_SETTINGS, MEDIA_MARGIN_SIDES } from './constants';

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

/**
 * The widget mapping of the components config, reduced to what the layout resolution reads. The
 * config itself comes from untyped JS, so the shape is described here at the consumption boundary.
 */
interface WidgetComponentsConfig {
  /**
   * The widgets of the v2 widget system, keyed by widget name.
   */
  widgetsV2?: Record<string, {
    /**
     * What the widget declared about itself in its config file.
     */
    config?: WidgetConfig;
  }>;
}

/**
 * Retrieves the sides on which a widget gets the media widget margins. Widgets declare them in a
 * "config.json" inside their folder, which the build adds to the widget mapping. A widget that
 * declares nothing keeps the margins of its own configuration.
 * @param name The name of the widget.
 * @returns The sides that get the media widget margins.
 */
export function getAppliedMediaMargins(name: string): AppliedMediaMargins {
  const { widgetsV2 } = componentsConfig as WidgetComponentsConfig;
  const declared = widgetsV2?.[name]?.config?.layout?.applyMediaMargins;

  if (declared === true) {
    return MEDIA_MARGIN_SIDES.reduce<AppliedMediaMargins>((sides, side) => ({
      ...sides,
      [side]: true,
    }), {});
  }

  if (declared && typeof declared === 'object') {
    return declared;
  }

  return {};
}

/**
 * Resolves the margins of a widget container. The configuration of the widget instance wins over
 * the media widget margin, which only applies to the sides the widget asked for.
 * @param definitionLayout The layout settings of the widget instance.
 * @param appliedMediaMargins The sides on which the widget gets the media widget margins.
 * @param settings The media widget margins.
 * @returns The resolved margins.
 */
export function resolveWidgetLayout(
  definitionLayout: Partial<WidgetDefinitionLayout> | undefined,
  appliedMediaMargins: AppliedMediaMargins,
  settings: MediaMarginSettings
): WidgetLayout {
  return MARGIN_SIDES.reduce<WidgetLayout>((layout, side) => {
    const mediaSide = MARGIN_SIDE_SETTINGS[side];

    return {
      ...layout,
      [side]: definitionLayout?.[side]
        ?? (appliedMediaMargins?.[mediaSide] ? settings?.[mediaSide] ?? 0 : 0),
    };
  }, {} as WidgetLayout);
}
