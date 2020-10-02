import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { fetchCheckoutOrder } from '../../actions/fetchCheckoutOrder';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => state => ({
  isUserLoggedIn: isUserLoggedIn(state),
});

const mapDispatchToProps = {
  fetchCheckoutOrder,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
