import { connect } from 'react-redux';
import { makeIsLastStackEntry, updateStatusBarBackground } from '@shopgate/engage/core';

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

/**
 * @param {Function} dispatch The redux dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  updateStatusBar: ({ background }, setDefault) => {
    dispatch(updateStatusBarBackground(background, setDefault));
  },
  resetStatusBar: () => {
    dispatch(updateStatusBarBackground());
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps);
