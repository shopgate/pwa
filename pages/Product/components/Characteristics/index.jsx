import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_VARIANT_SELECT,
  PRODUCT_VARIANT_SELECT_AFTER,
  PRODUCT_VARIANT_SELECT_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import ProductCharacteristics from '@shopgate/pwa-common/components/ProductCharacteristics';
import { ProductContext } from './../../context';
import Characteristic from './Characteristic';
import Swatch from './Swatch';

/**
 * The Characteristics component.
 */
class Characteristics extends PureComponent {
  static propTypes = {
    productId: PropTypes.string,
    variantId: PropTypes.string,
  };

  static defaultProps = {
    productId: null,
    variantId: null,
  };

  /**
   * @param {Object} props The consumer props.
   * @returns {JSX}
   */
  consumeRenderer = ({ conditioner, setCharacteristics }) => {
    const { productId, variantId } = this.props;

    return (
      <ProductCharacteristics
        productId={productId}
        variantId={variantId}
        render={this.renderer}
        conditioner={conditioner}
        finishTimeout={200}
        setCharacteristics={setCharacteristics}
      />
    );
  }

  /**
   * @see ProductCharacteristics.render
   * @param {Object} props The renderer props.
   * @returns {JSX}
   */
  renderer = (props) => {
    if (isBeta() && !!props.swatch) {
      return <Swatch {...props} />;
    }
    return <Characteristic {...props} />;
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal name={PRODUCT_VARIANT_SELECT_BEFORE} />
        <Portal name={PRODUCT_VARIANT_SELECT}>
          <ProductContext.Consumer>
            {this.consumeRenderer}
          </ProductContext.Consumer>
        </Portal>
        <Portal name={PRODUCT_VARIANT_SELECT_AFTER} />
      </Fragment>
    );
  }
}

Characteristics.propTypes = {
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

Characteristics.defaultProps = {
  productId: null,
  variantId: null,
};

export default Characteristics;
