import React from 'react';
import SortContext from '../providers/SortProvider.context';

/**
 * Gets the context props for the wrapped component.
 * @param {Object} context The context.
 * @param {string|null} prop The optional prop name.
 * @returns {Object}
 */
const getInjectedProps = (context, prop) => {
  if (!prop) {
    return context;
  }

  return {
    [prop]: { ...context },
  };
};

/**
 * Injects the SortContext properties into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop] An optional prop name to inject the sort properties.
 * @returns {JSX}
 */
const withSort = (WrappedComponent, options = {}) => {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithSort = props => (
    <SortContext.Consumer>
      { sortContext => (
        <WrappedComponent {...getInjectedProps(sortContext, options.prop)} {...props} />
      )}
    </SortContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithSort.displayName = `WithSort(${displayName})`;

  return WithSort;
};

export default withSort;
