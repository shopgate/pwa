// @flow
import { connect } from 'react-redux';

import { getIsLocationBasedShopping } from '@shopgate/engage/core';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';
import { selectGlobalLocation } from '@shopgate/engage/locations/action-creators';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  isLocationBasedShopping: getIsLocationBasedShopping(state),
  preferredLocation: getPreferredLocation(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  selectGlobalLocation,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
