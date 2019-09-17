import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import { getPrevRoute } from '@shopgate/engage/core';

/**
 * @param {Object} state state
 * @returns {Object}
 */
const mapStateToProps = (state) => {
  const prev = getPrevRoute(state);
  return {
    prevTitle: prev ? prev.state.title : null,
  };
};

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(historyPop()),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: () => null });
