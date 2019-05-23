import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ProductPrice } from '@shopgate/engage/components';
import { ProductPriceStriked } from '@shopgate/engage/components';
import styles from './style';
/**
 * Price component made for Favorites.
 */
class Price extends Component {
  static propTypes = {
    price: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      unitPriceStriked: PropTypes.number.isRequired,
      discount: PropTypes.number,
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
    return (
      <Fragment>
        {
          this.props.price.unitPriceStriked > 0
          && <ProductPriceStriked
            className={styles.strikedPrice}
            value={this.props.price.unitPriceStriked}
            currency={this.props.price.currency}
          />
        }
        <ProductPrice
          currency={this.props.price.currency}
          unitPrice={this.props.price.unitPrice}
          discounted={this.props.price.discount > 0}
          smallStriked
        />
      </Fragment>
    );
  }
}

export default Price;
