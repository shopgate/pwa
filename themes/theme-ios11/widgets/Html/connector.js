import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, target) => dispatch(historyPush({
    pathname,
    ...target && { state: { target } },
  })),
});

export default connect(null, mapDispatchToProps, null, { pure: () => true });
