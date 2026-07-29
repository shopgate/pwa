import {
  useMemo, useState, useCallback, type ReactNode,
} from 'react';
import { useWidgetPreviewEvent, dispatchWidgetPreviewEvent } from './events';
import {
  WidgetsPreviewContext,
  type WidgetsPreviewContextType,
} from './WidgetsPreviewContext';

/**
 * Props of the {@link WidgetsPreviewProvider} component.
 */
export interface WidgetsPreviewProviderProps {
  /**
   * The child components to render.
   */
  children: ReactNode;
}

/**
 * The WidgetsPreviewProvider component is used by the Widgets component when it's rendered
 * in preview mode. It provides functionality for the Widget component that's needed when
 * the widgets are rendered in the preview iframe.
 */
const WidgetsPreviewProvider = ({ children }: WidgetsPreviewProviderProps) => {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  useWidgetPreviewEvent('set-active-widget-id', (e) => {
    setActiveWidget(e.detail.widgetCode);
  });

  const handleSetActiveWidget = useCallback((code: string, highlight = false) => {
    setActiveWidget(code);

    if (highlight) {
      dispatchWidgetPreviewEvent('highlight-widget', code);
    }
  }, []);

  const value = useMemo<WidgetsPreviewContextType>(() => ({
    activeWidget,
    setActiveWidget: handleSetActiveWidget,
  }), [activeWidget, handleSetActiveWidget]);

  return (
    <WidgetsPreviewContext.Provider value={value}>
      {children}
    </WidgetsPreviewContext.Provider>
  );
};

export default WidgetsPreviewProvider;
