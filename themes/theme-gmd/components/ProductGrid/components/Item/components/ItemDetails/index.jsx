import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint, OrderQuantityHint, EffectivityDates, Swatches, getProductRoute,
} from '@shopgate/engage/product';
import { TextLink, Link } from '@shopgate/engage/components';
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
  };

  static defaultProps = {
    display: null,
    name: null,
    price: null,
    shortDescription: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      display, productId, name, price, shortDescription,
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
          tagName="a"
          href={getProductRoute(productId)}
          state={{ title: name }}
          className={styles.itemNameLink}
        >
          <ItemName display={display} productId={productId} name={name} />
        </TextLink>

        <Link
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
        </Link>

        <Link
          href={getProductRoute(productId)}
          state={{ title: name }}
          className={styles.itemPriceLink}
        >
          <ItemPrice display={display} productId={productId} price={price} />
        </Link>
      </div>
    );
  }
}

export default ItemDetails;
