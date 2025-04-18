import React from 'react';
import PropTypes from 'prop-types';
import { Provider, ReactReduxContext } from 'react-redux';
import Portal from 'react-portal';

/**
 * @typedef {import('@types/react-portal')} ReactPortal
 */

// eslint-disable-next-line valid-jsdoc
/**
 * ConnectedReactPortal is a wrapper around "react-portal" v3 that ensures
 * children rendered in the portal have access to the Redux store.
 *
 * This addresses the limitation introduced by the switch to the new Context API in react-redux v6,
 * where the Redux store is only accessible to components within the StoreProvider. Since the Portal
 * component renders its children outside the React component tree, this wrapper bridges the gap.
 *
 * @type {ReactPortal}
 */
const ConnectedReactPortal = ({ children, ...props }) => (
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

ConnectedReactPortal.propTypes = {
  children: PropTypes.node,
};

ConnectedReactPortal.defaultProps = {
  children: null,
};

export default ConnectedReactPortal;
