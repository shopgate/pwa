import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @param {Object} props Props.
 */
class CTAButtons extends Component {
  handleAddToCart = () => {
    this.props.addToCart({
      productId: this.props.productId,
      options: this.props.options,
      quantity: 1,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles.buttons}>
        <FavoritesButton
          active={this.props.isFavorite}
          productId={this.props.productId}
          className={styles.favButton}
          rippleClassName={styles.ripple}
        />
        <AddToCartButton
          buttonSize={styles.cartButtonSize}
          className={styles.cartButton}
          isLoading={this.props.isLoading}
          isDisabled={this.props.isDisabled}
          iconSize={styles.iconSize}
          onClick={this.handleAddToCart}
        />
      </div>
    );
  }
}
CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  addToCart: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  options: PropTypes.shape(),
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  addToCart: () => {},
  isLoading: false,
  isDisabled: false,
  options: null,
  productId: null,
};

export default connect(CTAButtons);
