import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, title) => () => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

export default connect(null, mapDispatchToProps);
