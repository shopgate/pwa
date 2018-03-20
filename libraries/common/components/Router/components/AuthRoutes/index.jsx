import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Redirect from '../Redirect';

/**
 * The AuthRoutes component
 * @param {Object} props The props of the component
 * @constructor
 */
const AuthRoutes = props => (
  <div>
    {React.Children.map(props.children, child => (
      props.isLoggedIn
        ? child
        : <Redirect to={props.to} path={child.props.path} />
    ))}
  </div>
);

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
};

AuthRoutes.contextTypes = {
  registerRoute: PropTypes.func.isRequired,
};

export default connect(AuthRoutes);
