import { connect } from 'react-redux';
import { fetchProductLocations } from '../../actions';

/**
 * @typedef {import('./CartChangeFulfillmentMethod.types').OwnProps} OwnProps
 * @typedef {import('./CartChangeFulfillmentMethod.types').DispatchProps} DispatchProps
 */

/**
 * @param {Function} dispatch The redux dispatch function.
 * @returns {DispatchProps} The extended component props.
 */
const mapDispatchToProps = {
  fetchProductLocations,
};

export default connect(
  null,
  mapDispatchToProps
);
