import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { makeIsCheckoutRoute } from '@shopgate/engage/checkout';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const isCheckoutRoute = makeIsCheckoutRoute();
  /**
   * Maps the contents of the state to the component props.
   * @param {Object} state The current application state.
   * @return {Object} The extended component props.
   */
  return state => ({
    routeSearchPhrase: getSearchPhrase(state),
    isCheckout: isCheckoutRoute(state),
  });
};

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  search: searchPhrase => dispatch(historyPush({ pathname: getSearchRoute(searchPhrase) })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
