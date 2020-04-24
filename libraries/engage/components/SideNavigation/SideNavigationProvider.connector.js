import { connect } from 'react-redux';
import {
  getCurrentRoute,
  getCurrentPathname,
  getCurrentParams,
} from '@shopgate/pwa-common/selectors/router';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  currentParams: getCurrentParams(state),
  currentPathname: getCurrentPathname(state),
  currentRoute: getCurrentRoute(state),
});

export default connect(makeMapStateToProps);
