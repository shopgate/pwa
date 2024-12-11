import React from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import { Provider, ReactReduxContext } from 'react-redux';

/**
 * The ReduxConnectedReactPortal component acts as a wrapper around "react-portal" and injects the
 * Redux store to give children access to it.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ReduxConnectedReactPortal = ({ children, ...props }) => (
  <ReactReduxContext.Consumer>
    {(ctx => (
      <Portal {...props}>
        <Provider store={ctx.store}>
          {children}
        </Provider>
      </Portal>
    ))}
  </ReactReduxContext.Consumer>
);

ReduxConnectedReactPortal.propTypes = {
  children: PropTypes.node,
};

ReduxConnectedReactPortal.defaultProps = {
  children: null,
};

export default ReduxConnectedReactPortal;
