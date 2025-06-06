import { type Context } from 'react';
import {
  type WidgetDefinitionLayout,
  type WidgetDefinitionVisibility,
  type WidgetDefinition,
} from './types'

export { WidgetDefinition } from './types';

export interface WidgetContextType {
  /**
   * The unique widget code
   */
  code: string;
  /**
   * The widget configuration
   */
  config: Record<string, any>;
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
