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
 * Layout settings for a widget.
 */
export interface WidgetDefinitionLayout {
  /**
   * Top margin for the widget.
   */
  marginTop: number;
  /**
   * Bottom margin for the widget.
   */
  marginBottom: number;
  /**
   * Left margin for the widget.
   */
  marginLeft: number;
  /**
   * Right margin for the widget.
   */
  marginRight: number;
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
  widgetConfig: Record<string, any>;
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
     * Message for the scheduled icon tooltip
     */
    scheduledIconMessage?: string;
    /**
     * Message for the hidden icon tooltip
     */
    hiddenIconMessage?: string;
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
