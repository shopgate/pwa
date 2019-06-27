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
    updateStatusBar: ({ color, background, buttonColor }) => {
      updateLegacyNavigationBar({
        color,
        background,
        buttonColor,
      });
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps);
