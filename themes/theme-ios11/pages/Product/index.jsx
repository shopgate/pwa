import React, { PureComponent } from 'react';
import View from 'Components/View';
import { Consume } from '@shopgate/engage/components';
import { hex2bin } from '@shopgate/engage/core';
import { RouteContext } from '@shopgate/engage/core';
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
      <View>
        <Consume context={RouteContext} props={props}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Product;
