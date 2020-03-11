// @flow
import { connect } from 'react-redux';
import { fetchProductLocations } from '../../actions';
import { type OwnProps, type DispatchProps } from './CartItemProductChangeLocation.types';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  fetchProductLocations,
};

export default connect<null, DispatchProps, OwnProps>(null, mapDispatchToProps);
