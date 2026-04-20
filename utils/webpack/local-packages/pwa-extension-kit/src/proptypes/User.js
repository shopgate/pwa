import PropTypes from 'prop-types';

const User = PropTypes.shape({
  isLoggedIn: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  displayName: PropTypes.string,
});

export default User;
