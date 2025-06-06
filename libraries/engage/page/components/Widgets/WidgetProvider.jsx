import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { WidgetContext } from './WidgetContext';

/**  @typedef {import('./WidgetContext').WidgetContextType} WidgetContextType */
/**  @typedef {import('./WidgetContext').WidgetDefinition} WidgetDefinition */

/**
 * The WidgetProvider component provides the context for a single widget.
 * @param {Object} props The component props.
 * @param {WidgetDefinition} props.definition The widget definition data.
 * @param {React.ReactNode} props.children The child components to render.
 * @returns {JSX.Element}
 */
const WidgetProvider = ({ children, definition }) => {
  /** @type {WidgetContextType} */
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

