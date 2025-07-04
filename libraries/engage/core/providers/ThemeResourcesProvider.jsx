import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext as LegacyThemeContext } from '@shopgate/pwa-common/context';
import { ThemeResourcesContext } from '../contexts';

/**
 * @typedef {Object<string, React.ComponentType<any>>} ComponentMap
 */

/**
 * ThemeResourcesProvider component.
 * @param {Object} props The component props.
 * @param {ComponentMap} props.widgets Mapping object with all available widget components for the
 * theme. Key is the widget code, value is the widget component.
 * @param {ComponentMap} props.components Object with shared theme components. Can be used by
 * extensions the get unified visual presentation.
 * @param {ComponentMap} [props.legacyThemeAPI] Object with shared theme components. Can be used by
 * extensions the get unified visual presentation.
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
  widgets: PropTypes.objectOf(PropTypes.elementType).isRequired,
  legacyThemeAPI: PropTypes.shape(),
};

ThemeResourcesProvider.defaultProps = {
  legacyThemeAPI: null,
};

export default ThemeResourcesProvider;
