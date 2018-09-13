import React, { PureComponent } from 'react';
import View from 'Components/View';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import ProductContent from './components/Content';

const props = {
  open: 'open',
  id: 'params.productId',
  isVariant: 'state.isVariant',
};

/**
 * The product detail page (PDP).
 */
class Product extends PureComponent {
  /**
   * @param {Object} props The consomer props.
   * @returns {JSX}
   */
  consumeRenderer = ({ open, id, isVariant }) => {
    if (!open) {
      return null;
    }

    return <ProductContent productId={hex2bin(id) || null} isVariant={isVariant || false} />;
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
