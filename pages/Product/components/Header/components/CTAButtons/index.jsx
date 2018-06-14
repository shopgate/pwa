import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @param {Object} props Props.
 */
class CTAButtons extends PureComponent {
  static propTypes = {
    // IsFavorite: PropTypes.bool.isRequired,
    addToCart: PropTypes.func,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    options: PropTypes.shape(),
    productId: PropTypes.string,
  };

  static defaultProps = {
    addToCart: () => {},
    isLoading: false,
    isDisabled: false,
    options: {},
    productId: null,
  };

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
        {/* <FavoritesButton
            active={props.isFavorite}
            productId={props.productId}
            className={styles.favButton}
            rippleClassName={styles.ripple}
          /> */}
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

export default connect(CTAButtons);
