import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Redirect from '../Redirect';
import { LOGIN_PATH } from '../../../../constants/RoutePaths';

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
  to: PropTypes.string,
};

AuthRoutes.defaultProps = {
  to: LOGIN_PATH,
};

AuthRoutes.contextTypes = {
  registerRoute: PropTypes.func.isRequired,
};

export default connect(AuthRoutes);
