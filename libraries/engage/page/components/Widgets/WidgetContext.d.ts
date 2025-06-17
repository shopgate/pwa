import { type Context } from 'react';
import {
  type WidgetDefinitionLayout,
  type WidgetDefinitionVisibility,
  type WidgetDefinition,
} from './types'

export { WidgetDefinition } from './types';

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
}

/**
 * React context for widgets.
 */
declare const WidgetContext: Context<WidgetContextType>;

export default WidgetContext;
