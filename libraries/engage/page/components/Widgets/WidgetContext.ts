import { createContext } from 'react';
import {
  type WidgetDefinitionVisibility,
  type WidgetLayout,
} from './types';

export { type WidgetDefinition } from './types';

/**
 * Context value provided by the {@link WidgetContext} for a single widget instance.
 */
export interface WidgetContextType<C = Record<string, unknown>> {
  /**
   * The unique code of the widget instance.
   */
  code: string;
  /**
   * The name of the widget.
   */
  name: string;
  /**
   * The widget configuration.
   */
  config: C;
  /**
   * The resolved margins of the widget container.
   */
  layout: WidgetLayout;
  /**
   * The widget visibility settings.
   */
  visibility: WidgetDefinitionVisibility;
  /**
   * Whether the widget is rendered in preview mode.
   */
  isPreview: boolean;
}

/**
 * React context for widgets.
 */
export const WidgetContext = createContext<WidgetContextType>({} as WidgetContextType);
