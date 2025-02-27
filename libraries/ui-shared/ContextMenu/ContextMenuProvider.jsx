import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './ContextMenuProvider.context';

/**
 * The Context Menu Provider
  * @param {Object} children The component props.
  * @param {Object} handleMenuToggle handleMenuToggle
  * @returns {JSX}
  */
const ContextMenuProvider = ({ children, handleMenuToggle }) => {
  const value = useMemo(() => ({
    handleMenuToggle,
  }), [handleMenuToggle]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

ContextMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
  handleMenuToggle: PropTypes.func,
};

ContextMenuProvider.defaultProps = {
  handleMenuToggle: () => {},
};

export default ContextMenuProvider;
