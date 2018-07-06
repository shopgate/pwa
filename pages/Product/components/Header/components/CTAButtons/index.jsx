import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import CartButton from './components/CartButton';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @param {Object} props Props.
 */
class CTAButtons extends PureComponent {
  static propTypes = {
    isFavorite: PropTypes.bool.isRequired,
    productId: PropTypes.string,
  };

  static defaultProps = {
    productId: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles.buttons}>
        <FavoritesButton
          active={this.props.isFavorite}
          className={styles.favButton}
          productId={this.props.productId}
          rippleClassName={styles.ripple}
        />
        <CartButton />
      </div>
    );
  }
}

export default connect(CTAButtons);
