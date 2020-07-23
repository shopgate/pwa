import { connect } from 'react-redux';
import { getShopSettings } from '@shopgate/engage/core/config';
import {
  makeGetLocationsForStoreFinder,
  getIsFetching,
  getUserSearch,
  getStoreFinderSearch,
} from '../selectors';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getLocationsForStoreFinder = makeGetLocationsForStoreFinder();

  return (state, props) => ({
    locations: getLocationsForStoreFinder(state, props),
    isFetching: getIsFetching(state),
    shopSettings: getShopSettings(state),
    userSearch: getUserSearch(state),
    storeFinderSearch: getStoreFinderSearch(state, props),
  });
};

export default connect(makeMapStateToProps);
