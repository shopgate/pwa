import { connect } from 'react-redux';
import { historyPop, historyReplace } from '@shopgate/pwa-common/actions/router';
import { makeGetPrevRoute, INDEX_PATH } from '@shopgate/engage/core';

/**
 * Create exclusive component selector.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getPrevRoute = makeGetPrevRoute();
  return (state, { route }) => {
    const prev = getPrevRoute(state, { routeId: route.id });
    return {
      hasPrevRoute: !!prev,
      prevTitle: prev && prev.state.title ? prev.state.title : null,
    };
  };
}

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(historyPop()),
  goHome: () => dispatch(historyReplace({ pathname: INDEX_PATH })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
