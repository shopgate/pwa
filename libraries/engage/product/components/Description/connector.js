import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import { getProductDescription } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  html: getProductDescription(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, target) => dispatch(historyPush({
    pathname,
    ...target && { state: { target } },
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
