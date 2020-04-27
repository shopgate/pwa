import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  routeSearchPhrase: getSearchPhrase(state),
});

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  search: searchPhrase => dispatch(historyPush({ pathname: getSearchRoute(searchPhrase) })),
});

export default connect(mapStateToProps, mapDispatchToProps);
