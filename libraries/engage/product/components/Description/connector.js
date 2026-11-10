import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import { getProductDescription } from '@shopgate/engage/product';
import {
  getProductDescriptionState,
  getProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const entry = getProductDescriptionState(state)[getProductId(state, props)];

  return {
    html: getProductDescription(state, props),
    isLoading: !entry || !!entry.isFetching,
  };
};

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
