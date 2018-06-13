import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: location => dispatch(navigate('PUSH', location)),
});

export default connect(null, mapDispatchToProps);
