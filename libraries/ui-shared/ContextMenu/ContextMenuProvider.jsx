import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './ContextMenuProvider.context';

/**
 * The Context Menu Provider
 *
 * @param {Object} props The component props.
 * @param {Object} props.children The component props.
 * @param {Object} props.handleMenuToggle Toggles visibility of the ContextMenu.
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
