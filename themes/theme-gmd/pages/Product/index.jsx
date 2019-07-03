import React, { PureComponent } from 'react';
import View from 'Components/View';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@shopgate/pwa-common/context';
import ProductContent from './components/Content';

const props = {
  open: 'open',
  id: 'params.productId',
  state: 'state',
};

/**
 * The product detail page (PDP).
 */
class Product extends PureComponent {
  /**
   * @param {Object} props The consumer props.
   * @returns {JSX}
   */
  consumeRenderer = ({ open, id, state }) => {
    if (!open) {
      return null;
    }

    const productId = state.productId || hex2bin(id);

    return <ProductContent productId={productId || null} isVariant={!!state.productId} />;
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <View aria-hidden={false}>
        <Consume context={RouteContext} props={props}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Product;
