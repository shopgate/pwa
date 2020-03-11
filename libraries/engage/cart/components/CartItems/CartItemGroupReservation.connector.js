// @flow
import { connect } from 'react-redux';
import { makeGetLocation } from '@shopgate/engage/locations';
import { type OptionalLocationAware } from '@shopgate/engage/locations/locations.types';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getLocation = makeGetLocation();
  return (state, props): OptionalLocationAware => ({
    location: getLocation(state, props),
  });
};

export default connect<OptionalLocationAware>(makeMapStateToProps);
