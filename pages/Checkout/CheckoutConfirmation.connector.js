import { connect } from 'react-redux';
import { historyReset } from '@shopgate/pwa-common/actions/router';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(historyReset()),
});

export default connect(null, mapDispatchToProps);
