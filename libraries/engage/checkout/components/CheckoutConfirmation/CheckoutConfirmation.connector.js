import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => state => ({
  isUserLoggedIn: isUserLoggedIn(state),
});

export default connect(makeMapStateToProps);
