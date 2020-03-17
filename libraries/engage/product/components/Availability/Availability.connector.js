// @flow
import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product/constants';
import { type OwnProps, type StateProps } from './Availability.types';
import { type State } from '../../../types';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
function mapStateToProps(state: State, props: OwnProps) {
  const product = getProduct(state, props);

  if (!product) {
    return {
      availability: null,
      fulfillmentMethods: null,
    };
  }

  return {
    // Show stock info always as availability on PDP
    availability: !product.stock ? null : {
      text: product.stock.info,
      state: AVAILABILITY_STATE_OK,
    },
    fulfillmentMethods: product.fulfillmentMethods || null,
  };
}

export default connect<StateProps, null, OwnProps>(mapStateToProps);
