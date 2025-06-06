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
}
