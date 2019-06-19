import { connect } from 'react-redux';
import { makeIsLastStackEntry } from '@shopgate/engage/core';

/**
 * Create exclusive component selector.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const isLastStackEntry = makeIsLastStackEntry();
  return (state, { route }) => ({
    setFocus: route.visible && isLastStackEntry(state, { routeId: route.id }),
  });
}

export default connect(makeMapStateToProps);
