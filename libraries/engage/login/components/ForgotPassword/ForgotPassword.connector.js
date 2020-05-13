import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import { resetPassword } from '../../actions';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  resetPassword: email => dispatch(resetPassword(email)),
  goBack: () => dispatch(historyPop()),
});

export default connect(null, mapDispatchToProps);
