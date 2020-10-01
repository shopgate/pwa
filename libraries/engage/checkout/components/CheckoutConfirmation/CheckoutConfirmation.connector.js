import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import fetchOrderDetails from '../../../orders/actions/fetchOrderDetails';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => state => ({
  isUserLoggedIn: isUserLoggedIn(state),
});

const mapDispatchToProps = {
  fetchOrderDetails,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
