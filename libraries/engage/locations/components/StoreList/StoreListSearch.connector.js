// @flow
import { connect } from 'react-redux';
import {
  makeGetIsFetchingProductLocations,
  makeGetUserSearch,
} from '../../selectors';
import { storeSearch } from '../../action-creators';
import { getProductLocations } from './StoreListSearch.actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getIsFetchingProductLocations = makeGetIsFetchingProductLocations();
  const getUserSearch = makeGetUserSearch();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    loading: getIsFetchingProductLocations(state, props),
    search: getUserSearch(state),
  });
}

const mapDispatchToProps = {
  getProductLocations,
  storeSearch,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
