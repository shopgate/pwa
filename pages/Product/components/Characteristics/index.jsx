import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProductCharacteristics from '@shopgate/pwa-common/components/ProductCharacteristics';
import { ProductContext } from './../../context';
import Characteristic from './Characteristic';

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
  consumeRenderer = ({ conditioner }) => {
    const { productId, variantId } = this.props;

    return (
      <ProductCharacteristics
        productId={productId}
        variantId={variantId}
        render={this.renderer}
        conditioner={conditioner}
        finishTimeout={200}
      />
    );
  }

  /**
   * @param {Object} props The renderer props.
   * @returns {JSX}
   */
  renderer = props => (
    <Characteristic {...props} />
  );

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <ProductContext.Consumer>
        {this.consumeRenderer}
      </ProductContext.Consumer>
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
