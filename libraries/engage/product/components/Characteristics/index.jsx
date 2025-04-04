import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_VARIANT_SELECT,
  PRODUCT_VARIANT_SELECT_AFTER,
  PRODUCT_VARIANT_SELECT_BEFORE,
} from '@shopgate/engage/product/constants';
import { ProductCharacteristics } from '@shopgate/engage/product/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
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
  consumeRenderer = ({ conditioner, setCharacteristics, characteristics }) => {
    const { productId, variantId } = this.props;

    return (
      <ProductCharacteristics
        productId={productId}
        variantId={variantId}
        render={this.renderer}
        conditioner={conditioner}
        finishTimeout={200}
        setCharacteristics={setCharacteristics}
        characteristics={characteristics}
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
