// @flow
import { connect } from 'react-redux';
import { hasProductVariants, isProductOrderable } from '@shopgate/engage/product';
import { type OwnProps, type StateProps } from './FulfillmentSelectorItemDirectShip.types';

/**
 * @param {Object} state .
 * @param {Object} props .
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  isOrderable: isProductOrderable(state, props) || hasProductVariants(state, props),
});

export default connect<StateProps, null, OwnProps>(mapStateToProps);
