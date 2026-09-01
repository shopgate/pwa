import { type MediaMarginSettings } from '@shopgate/engage/settings/types/appSettings';

/**
 * Visibility settings for a widget.
 */
export interface WidgetDefinitionVisibility {
  /**
   * Whether the widget is hidden.
   */
  isHidden: boolean;
  /**
   * Start date for scheduled widgets.
   */
  scheduleStartDate: string;
  /**
   * End date for scheduled widgets.
   */
  scheduleEndDate: string
}

/**
 * Layout settings for a widget. A side is null when it has no own configuration.
 */
export interface WidgetDefinitionLayout {
  /**
   * Top margin for the widget.
   */
  marginTop: number | null;
  /**
   * Bottom margin for the widget.
   */
  marginBottom: number | null;
  /**
   * Left margin for the widget.
   */
  marginLeft: number | null;
  /**
   * Right margin for the widget.
   */
  marginRight: number | null;
}

/**
 * Margins of a widget container after resolution. Every side is a number, never null.
 */
export type WidgetLayout = Record<keyof WidgetDefinitionLayout, number>;

/**
 * The sides on which a widget gets the media widget margins. An omitted side does not.
 */
export type AppliedMediaMargins = Partial<Record<keyof MediaMarginSettings, boolean>>;

/**
 * Static configuration a widget declares about itself. It is picked up at build time, so its
 * values are known before the widget is loaded.
 */
export interface WidgetConfig {
  /**
   * How the container that the page builder renders around the widget behaves.
   */
  layout?: {
    /**
     * On which sides the widget gets the media widget margins that merchants configure in the
     * theme settings. True for all sides, false for none, or an object to opt in per side.
     * Margins configured for a single widget instance always win.
     */
    applyMediaMargins?: boolean | AppliedMediaMargins;
  };
}

/**
 * Definition of a API widget
 */
export interface WidgetDefinition {
  /**
   * Unique code for the widget.
   */
  code: string;
  /**
   * Name of the widget
   */
  widgetConfigDefinitionCode: string;
  /**
   * Individual configuration for the widget.
   */
  widgetConfig: Record<string, unknown>;
  /**
   * Whether the widget is a legacy custom widget provided by an extension that's configured
   * via an HTML comment inside a HTML widget.
   */
  isCustomLegacyWidget?: boolean;
  /**
   * Visibility settings for the widget.
   */
  visibility: WidgetDefinitionVisibility;
  /**
   * Layout settings for the widget.
   */
  layout: WidgetDefinitionLayout;
  /**
   * Optional metadata for the widget (only available in preview mode)
   */
  meta?: {
    /**
     * Hidden state related data
     */
    hidden: {
      /**
       * Whether the widget is hidden.
       */
      isHidden: boolean;
      /**
       * Tooltip text for hidden related UI elements.
       */
      tooltip: string;
      /**
       * Label text for hidden related UI elements.
       */
      label: string;
    };
    /**
     * Scheduled state related data
     */
    scheduled: {
      /**
       * Indicates if the widget is scheduled.
       */
      isScheduled: boolean;
      /**
       * Indicates that the widget schedule time frame is currently active.
       */
      isActive: boolean;
      /**
       * Indicates if the scheduled time frame has expired
       */
      isExpired: boolean;
      /**
       * Tooltip text for schedule related UI elements.
       */
      tooltip: string;
      /**
       * Label text for schedule related UI elements.
       */
      label: string;
    };
  }
}

export interface ScheduledStatus {
  /**
   * Indicates if the widget is scheduled.
   */
  isScheduled: boolean;
  /**
   * Indicates if the widget is currently hidden based on the scheduling
   */
  isHidden: boolean;
  /**
   * Indicates if the scheduled time frame has expired.
   */
  isExpired: boolean;
}
