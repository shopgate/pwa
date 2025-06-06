import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useWidgetPreviewEvent, dispatchWidgetPreviewEvent } from './events';
import { WidgetsPreviewContext } from './WidgetsPreviewContext';

/**
 * The WidgetsPreviewProvider component is used by the Widgets component when it's rendered
 * in preview mode. It provides functionality for the Widget component that's needed when
 * the widgets are rendered in the preview iframe.
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components to render.
 * @returns {JSX.Element}
 */
const WidgetsPreviewProvider = ({ children }) => {
  const [activeWidget, setActiveWidget] = useState(null);

  useWidgetPreviewEvent('set-active-widget-id', (e) => {
    setActiveWidget(e.detail.widgetCode);
  });

  const handleSetActiveWidget = useCallback((code, highlight = false) => {
    setActiveWidget(code);

    if (highlight) {
      dispatchWidgetPreviewEvent('highlight-widget', code);
    }
  }, []);

  const value = useMemo(() => ({
    activeWidget,
    setActiveWidget: handleSetActiveWidget,
  }), [activeWidget, handleSetActiveWidget]);

  return (
    <WidgetsPreviewContext.Provider value={value}>
      {children}
    </WidgetsPreviewContext.Provider>
  );
};

WidgetsPreviewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WidgetsPreviewProvider;
