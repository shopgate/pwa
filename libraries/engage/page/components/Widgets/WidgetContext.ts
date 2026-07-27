import { createContext, type Context } from 'react';
import type {
  WidgetDefinitionLayout,
  WidgetDefinitionVisibility,
} from './types';

export type { WidgetDefinition } from './types';

export interface WidgetContextType<C = Record<string, any>> {
  /**
   * The unique code of the widget instance
   */
  code: string;
  /**
   * The name of the widget
   */
  name: string;
  /**
   * The widget configuration
   */
  config: C;
  /**
   * The widget layout settings
   */
  layout: WidgetDefinitionLayout;
  /**
   * The widget visibility settings
   */
  visibility: WidgetDefinitionVisibility;
  /**
   * Whether the widget is rendered in preview mode
   */
  isPreview: boolean;
}

/**
 * React context for widgets. The default value is empty; a meaningful value is
 * only provided by the WidgetProvider, so consumers rendered outside a widget
 * receive an empty object.
 */
export const WidgetContext: Context<WidgetContextType> = createContext<WidgetContextType>(
  {} as WidgetContextType
);

export default WidgetContext;
