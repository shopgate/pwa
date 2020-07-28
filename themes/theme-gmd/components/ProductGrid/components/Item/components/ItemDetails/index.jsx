import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint, OrderQuantityHint, EffectivityDates, Swatches, getProductRoute,
} from '@shopgate/engage/product';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  TextLink, Link, Availability,
} from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import ShortDescription from '../ShortDescription';
import * as styles from './style';

/**
 * The item details component.
 */
class ItemDetails extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    display: PropTypes.shape(),
    name: PropTypes.string,
    price: PropTypes.shape(),
    shortDescription: PropTypes.string,
    stock: PropTypes.shape(),
  };

  static defaultProps = {
    display: null,
    name: null,
    price: null,
    shortDescription: null,
    stock: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      display, productId, name, price, shortDescription, stock,
    } = this.props;

    if (display && !display.name && !display.price && !display.reviews) {
      return null;
    }

    return (
      <div className={styles.details} tabIndex={-1} role="button">
        <Link
          href={getProductRoute(productId)}
          state={{ title: name }}
        >
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <Swatches productId={productId} />
        </Link>
        <TextLink
          href={getProductRoute(productId)}
          state={{ title: name }}
          className={styles.itemNameLink}
        >
          <ItemName display={display} productId={productId} name={name} />
        </TextLink>

        <Link
          tag="a"
          href={getProductRoute(productId)}
          state={{ title: name }}
          className={styles.propertiesLink}
        >
          <ShortDescription shortDescription={shortDescription} />

          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <MapPriceHint productId={productId} />

          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <OrderQuantityHint productId={productId} />

          {/* This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <EffectivityDates productId={productId} />

          <Availability
            state={!stock || stock.orderable
              ? AVAILABILITY_STATE_OK
              : AVAILABILITY_STATE_ALERT
            }
            text={i18n.text('product.available.not')}
            showWhenAvailable={false}
          />

          <div className={styles.itemPrice}>
            <ItemPrice display={display} productId={productId} price={price} />
          </div>
        </Link>
      </div>
    );
  }
}

export default ItemDetails;
