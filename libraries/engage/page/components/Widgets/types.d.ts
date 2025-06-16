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
