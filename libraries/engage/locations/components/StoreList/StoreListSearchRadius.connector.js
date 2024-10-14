import { connect } from 'react-redux';
import { makeGetDefaultUnitSystem } from '@shopgate/engage/core/config/config.selectors';
import { getStoreFinderSearchRadius } from '../../selectors';
import { setStoreFinderSearchRadius } from '../../action-creators';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getDefaultUnitSystem = makeGetDefaultUnitSystem();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return state => ({
    radius: getStoreFinderSearchRadius(state),
    unitSystem: getDefaultUnitSystem(state),
  });
}

const mapDispatchToProps = {
  setRadius: setStoreFinderSearchRadius,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
