import React, { PureComponent } from 'react';
import { View } from '@shopgate/engage/components';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@shopgate/pwa-common/context';
import { themeConfig } from '@shopgate/engage';
import ProductContent from './components/Content';

const { colors } = themeConfig;

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
   * @return {JSX.Element}
   */
  render() {
    return (
      <View background={colors.light}>
        <Consume context={RouteContext} props={props}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Product;
