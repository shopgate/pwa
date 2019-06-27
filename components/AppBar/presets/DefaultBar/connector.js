import { connect } from 'react-redux';
import { makeIsLastStackEntry, updateLegacyNavigationBar } from '@shopgate/engage/core';

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
 * @returns {Object}
 */
function mapDispatchToProps() {
  return {
    updateStatusBar: ({ color, background }) => {
      updateLegacyNavigationBar({
        color,
        background,
      });
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps);
