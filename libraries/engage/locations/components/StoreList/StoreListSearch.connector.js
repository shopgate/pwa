// @flow
import { connect } from 'react-redux';
import {
  makeGetIsFetchingProductLocations,
  makeGetUserSearchQuery,
} from '../../selectors';
import { storeSearchQuery } from '../../action-creators';
import { getProductLocations } from './StoreListSearch.actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getIsFetchingProductLocations = makeGetIsFetchingProductLocations();
  const getUserSearchQuery = makeGetUserSearchQuery();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    loading: getIsFetchingProductLocations(state, props),
    searchQuery: getUserSearchQuery(state),
  });
}

const mapDispatchToProps = {
  getProductLocations,
  storeSearchQuery,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
