import { connect } from 'react-redux';
import { getShopSettings } from '@shopgate/engage/core/config';
import {
  getIsFetching, getStoreFinderSearch, getUserSearch, makeGetLocationsForStoreFinder,
} from '../selectors';
import { selectGlobalLocation, selectLocation } from '../action-creators';

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

const mapDispatchToProps = {
  selectLocation,
  selectGlobalLocation,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
