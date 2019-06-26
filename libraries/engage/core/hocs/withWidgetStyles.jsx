import React from 'react';
import { useWidgetStyles } from '../hooks/useWidgetStyles';

/**
 * Retrieves the styles for a specific widget by its ID.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index] The optional index of the widget.
 * @returns {Object}
 */
export function withWidgetStyles(WrappedComponent, widgetId, index) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithWidgetStyles = (props) => {
    const styles = useWidgetStyles(widgetId, index);
    return (<WrappedComponent widgetStyles={styles} {...props} />);
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithWidgetStyles.displayName = `WithWidgetStyles(${displayName})`;

  return WithWidgetStyles;
}
