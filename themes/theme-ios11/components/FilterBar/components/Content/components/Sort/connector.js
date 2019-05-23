import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/engage/core';
import { historyReplace } from '@shopgate/engage/core';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  route: getCurrentRoute(state),
});

const mapDispatchToProps = {
  historyReplace: params => historyReplace(params),
};

export default connect(mapStateToProps, mapDispatchToProps);
