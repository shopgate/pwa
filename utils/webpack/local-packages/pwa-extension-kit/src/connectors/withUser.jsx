import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isUserLoggedIn,
  getUserFirstName,
  getUserEmail,
  getUserDisplayName,
} from '@shopgate/pwa-common/selectors/user';
import {
  getUserLastName,
  getUserId,
} from './selectors/user';
import { User } from '../proptypes';

/**
 * WithUser wrapper.
 * @param {function} WrappedComponent Wrapped component.
 * @param {Object} user Mapped user data.
 * @returns {JSX}
 */
const WithUser = ({ WrappedComponent, user, ...otherProps }) => (
  <WrappedComponent
    user={user}
    {...otherProps}
  />
);

WithUser.propTypes = {
  user: User.isRequired,
  WrappedComponent: PropTypes.func.isRequired,
};

/**
 * Maps state to props.
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  user: {
    isLoggedIn: isUserLoggedIn(state) || false,
    id: getUserId(state) || null,
    email: getUserEmail(state) || null,
    firstName: getUserFirstName(state) || null,
    lastName: getUserLastName(state) || null,
    displayName: getUserDisplayName(state) || null,
  },

});

const ConnectedWithUser = connect(mapStateToProps)(WithUser);

/**
* Returns a Wrapped Component with current user data.
* @param {function} WrappedComponent Component which will be wrapped with data connector.
* @returns {function} React component.
*/
const withUser = WrappedComponent => props =>
  <ConnectedWithUser WrappedComponent={WrappedComponent} {...props} />;

export default withUser;
