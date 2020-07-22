import { connect } from 'react-redux';
import { getShopSettings } from '@shopgate/engage/core/config';
import {
  makeGetLocationsForStoreFinder,
  getPreferredLocation,
  getIsFetching,
  getUserSearch,
} from '../selectors';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getLocationsForStoreFinder = makeGetLocationsForStoreFinder();

  return (state, props) => ({
    locations: getLocationsForStoreFinder(state, props),
    preferredLocation: getPreferredLocation(state, props),
    isFetching: getIsFetching(state),
    shopSettings: getShopSettings(state),
    userSearch: getUserSearch(state),
  });
};

export default connect(makeMapStateToProps);
