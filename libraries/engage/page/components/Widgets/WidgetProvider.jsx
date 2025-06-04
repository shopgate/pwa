import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {import('./Widgets.jsx').WidgetDefinition} WidgetDefinition
 */

/**
 * @typedef {Object} WidgetContextType
 * @property {WidgetDefinition['code']} code The unique widget code.
 * @property {WidgetDefinition['widgetConfig']} config The widget configuration.
 * @property {WidgetDefinition['layout']} layout The widget layout settings.
 * @property {WidgetDefinition['visibility']} visibility The widget visibility settings.
 */

/** @type {React.Context<WidgetContextType>} */
export const WidgetContext = createContext();

/**
 * The WidgetProvider component provides the context for widgets.
 * @param {Object} props The component props.
 * @param {WidgetDefinition} props.definition The widget definition data.
 * @param {React.ReactNode} props.children The child components to render.
 * @returns {JSX.Element}
 */
const WidgetProvider = ({ children, definition }) => {
  const value = useMemo(() => {
    const {
      widgetConfig, layout, visibility, code,
    } = definition;
    return {
      config: widgetConfig,
      layout,
      visibility,
      code,
    };
  }, [definition]);

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
};

WidgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
  definition: PropTypes.shape().isRequired,
};

export default WidgetProvider;

