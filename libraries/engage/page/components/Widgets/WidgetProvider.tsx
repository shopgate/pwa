import { useMemo, type ReactNode } from 'react';
import { WidgetContext, type WidgetContextType } from './WidgetContext';
import { type WidgetDefinition, type WidgetLayout } from './types';

/**
 * Props of the {@link WidgetProvider} component.
 */
export interface WidgetProviderProps {
  /**
   * The child components to render.
   */
  children: ReactNode;
  /**
   * The widget definition data.
   */
  definition: WidgetDefinition;
  /**
   * Whether the widget is in preview mode.
   */
  isPreview: boolean;
  /**
   * The resolved margins of the widget container.
   */
  layout: WidgetLayout;
}

/**
 * The WidgetProvider component provides the context for a single widget.
 */
const WidgetProvider = ({
  children, definition, isPreview, layout,
}: WidgetProviderProps) => {
  const value = useMemo<WidgetContextType>(() => {
    const {
      widgetConfig, visibility, code, widgetConfigDefinitionCode,
    } = definition;
    return {
      code,
      name: widgetConfigDefinitionCode,
      config: widgetConfig,
      layout,
      visibility,
      isPreview,
    };
  }, [definition, isPreview, layout]);

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
};

export default WidgetProvider;
