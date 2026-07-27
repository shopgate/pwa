import { createContext } from 'react';
import { noop } from 'lodash';

/**
 * Sets the active widget in the preview context.
 * @param code The code of the widget to set as active.
 * @param highlight Whether to highlight the widget after setting it as active.
 */
export type SetActiveWidget = (code: string, highlight?: boolean) => void;

/**
 * Context value provided by the {@link WidgetsPreviewContext}.
 */
export interface WidgetsPreviewContextType {
  /**
   * The code of the currently active widget.
   */
  activeWidget: string | null;
  /**
   * A function to set the active widget code.
   */
  setActiveWidget: SetActiveWidget;
}

export const WidgetsPreviewContext = createContext<WidgetsPreviewContextType>({
  activeWidget: null,
  setActiveWidget: noop,
});
