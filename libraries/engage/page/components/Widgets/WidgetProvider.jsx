import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { WidgetContext } from './WidgetContext';

/**  @typedef {import('./WidgetContext').WidgetContextType} WidgetContextType */
/**  @typedef {import('./WidgetContext').WidgetDefinition} WidgetDefinition */

/**
 * The WidgetProvider component provides the context for a single widget.
 * @param {Object} props The component props.
 * @param {WidgetDefinition} props.definition The widget definition data.
 * @param {boolean} props.isPreview Whether the widget is in preview mode.
 * @param {React.ReactNode} props.children The child components to render.
 * @returns {JSX.Element}
 */
const WidgetProvider = ({ children, definition, isPreview }) => {
  /** @type {WidgetContextType} */
  const value = useMemo(() => {
    const {
      widgetConfig, layout, visibility, code, widgetConfigDefinitionCode,
    } = definition;
    return {
      code,
      name: widgetConfigDefinitionCode,
      config: widgetConfig,
      layout,
      visibility,
      isPreview,
    };
  }, [definition, isPreview]);

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
};

WidgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
  definition: PropTypes.shape().isRequired,
  isPreview: PropTypes.bool.isRequired,
};

export default WidgetProvider;

