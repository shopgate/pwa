import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import { makeGetPrevRoute } from '@shopgate/engage/core';

/**
 * Create exclusive component selector.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getPrevRoute = makeGetPrevRoute();
  return (state, { route }) => {
    const prev = getPrevRoute(state, { routeId: route.id });
    return {
      prevTitle: prev ? prev.state.title : null,
    };
  };
}

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(historyPop()),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
