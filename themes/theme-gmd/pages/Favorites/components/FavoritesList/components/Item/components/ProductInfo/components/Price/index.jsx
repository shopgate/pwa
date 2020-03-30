import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ProductPrice from '@shopgate/pwa-ui-shared/Price';
import ProductPriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import styles from './style';
/**
 * Price component made for Favorites.
 */
class Price extends Component {
  static propTypes = {
    price: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      unitPriceStriked: PropTypes.number,
      discount: PropTypes.number,
      info: PropTypes.string,
    }).isRequired,
  };

  /**
   * Checks if component should update.
   * @param {Object} nextProps Next props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !(
      this.props.price.currency === nextProps.price.currency
      && this.props.price.unitPrice === nextProps.price.unitPrice
      && this.props.price.unitPriceStriked === nextProps.price.unitPriceStriked
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      unitPrice, discount, currency, unitPriceStriked, info,
    } = this.props.price;

    return (
      <Fragment>
        {(!!unitPriceStriked && unitPriceStriked > 0) && (
          <ProductPriceStriked
            className={styles.strikedPrice}
            value={unitPriceStriked}
            currency={currency}
          />
        )}
        <ProductPrice
          currency={currency}
          unitPrice={unitPrice}
          discounted={discount > 0}
          smallStriked
          className={styles.price}
        />
        {info !== '' && (
          <PriceInfo text={info} className={styles.basePrice} />
        )}
      </Fragment>
    );
  }
}

export default Price;
