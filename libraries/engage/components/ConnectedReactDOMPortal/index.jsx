import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, ReactReduxContext } from 'react-redux';

/**
 * ConnectedReactDOMPortal renders children into a specified DOM node using React's
 * `createPortal`. It ensures that the rendered children have access to the Redux store
 * by wrapping them in a `Provider` component.
 *
 * This is particularly useful for rendering elements outside the main React DOM tree
 * while maintaining access to the application state.
 *
 * @param {Object} props - The component props.
 * @param {HTMLElement} props.domNode - The DOM node where the portal will be rendered.
 * @param {React.ReactNode} [props.children] - The content to render into the portal.
 * @param {string|number} [props.key] - An optional key to uniquely identify the portal.
 * @returns {React.ReactPortal} A React portal rendering the children into the specified DOM node.
 */
const ConnectedReactDOMPortal = ({ children, domNode, key }) => (
  <ReactReduxContext.Consumer>
    {ctx => createPortal(
      <Provider store={ctx.store}>
        {children}
      </Provider>,
      domNode, key
    )}
  </ReactReduxContext.Consumer>
);

ConnectedReactDOMPortal.propTypes = {
  domNode: PropTypes.instanceOf(Node).isRequired,
  children: PropTypes.node,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ConnectedReactDOMPortal.defaultProps = {
  children: null,
  key: null,
};

export default ConnectedReactDOMPortal;
