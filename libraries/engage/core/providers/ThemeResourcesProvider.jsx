import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext as LegacyThemeContext } from '@shopgate/pwa-common/context';
import { ThemeResourcesContext } from '../contexts';

/**
 * @typedef {import('../contexts/ThemeResourcesContext').ThemeComponentMap} ThemeComponentMap
 */

/**
 * @typedef {Object} Widgets
 * @property {ThemeComponentMap} v1 All available widgets for Widget API v1
 * @property {ThemeComponentMap} v2 All available widgets for Widget API v2
 */

/**
 * ThemeResourcesProvider component.
 * @param {Object} props The component props.
 * @param {Widgets} props.widgets Mapping object with all available widget components for the
 * theme. Key is the widget code, value is the widget component.
 * @param {ThemeComponentMap} props.components Object with shared theme components. Can be used by
 * extensions the get unified visual presentation.
 * @param {ThemeComponentMap} [props.legacyThemeAPI] Object with shared theme components. Can be
 * used by extensions the get unified visual presentation.
 * Kept for backward compatibility with existing extensions which use the deprecated `ThemeContext`.
 * @param {React.ReactNode} props.children The component children.
 * @returns {JSX.Element}
 */
const ThemeResourcesProvider = ({
  widgets,
  components,
  legacyThemeAPI,
  children,
}) => {
  const value = useMemo(() => ({
    widgets,
    components,
  }), [components, widgets]);

  return (
    <ThemeResourcesContext.Provider value={value}>
      {/* LegacyThemeContext is used for backward compatibility with existing extensions */}
      {legacyThemeAPI ? (
        <LegacyThemeContext.Provider value={legacyThemeAPI}>
          {children}
        </LegacyThemeContext.Provider>
      ) : (children)}
    </ThemeResourcesContext.Provider>
  );
};

ThemeResourcesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  components: PropTypes.objectOf(PropTypes.elementType).isRequired,
  widgets: PropTypes.shape().isRequired,
  legacyThemeAPI: PropTypes.shape(),
};

ThemeResourcesProvider.defaultProps = {
  legacyThemeAPI: null,
};

export default ThemeResourcesProvider;
