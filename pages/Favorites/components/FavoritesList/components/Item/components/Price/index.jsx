/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ProductPrice from 'Components/Price';
import ProductPriceStriked from 'Components/PriceStriked';
import styles from './styles';
/**
 * Price component made for Favorites.
 */
class Price extends Component {
  static propTypes = {
    price: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      unitPriceWithTax: PropTypes.number.isRequired,
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
      && this.props.price.unitPriceWithTax === nextProps.price.unitPriceWithTax
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
          unitPrice={this.props.price.unitPriceWithTax}
          discounted={this.props.price.discount > 0}
          smallStriked
        />
      </Fragment>
    );
  }
}

export default Price;
