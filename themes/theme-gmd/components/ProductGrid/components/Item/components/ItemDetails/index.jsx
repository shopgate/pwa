import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Swatches,
  getProductRoute,
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/engage/product';
import { Link, Availability } from '@shopgate/engage/components';
import { StockInfoLists } from '@shopgate/engage/locations/components';
import { hasNewServices as checkHasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { useNavigation } from '@shopgate/engage/core/hooks';
import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import ShortDescription from '../ShortDescription';
import * as styles from './style';

/**
 * The item details component.
 * @returns {JSX.Element}
 */
const ItemDetails = ({ product, display }) => {
  const {
    id: productId, name = null, stock = null, shortDescription = null,
  } = product;

  const hasNewServices = useMemo(() => checkHasNewServices(), []);
  const { push } = useNavigation();

  // click events necessary for a11y navigation on Android
  const handleClick = useCallback(() => {
    push({
      pathname: getProductRoute(productId),
    });
  }, [productId, push]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  }, [handleClick]);

  if (display && !display.name && !display.price && !display.reviews) {
    return null;
  }

  return (
    <Link
      className={`${styles.details} theme__product-grid__item__item-details`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      href={getProductRoute(productId)}
    >
      <div>
        {/*
          This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <Swatches productId={productId} />
      </div>
      <div className={styles.itemNameLink}>
        <ItemName display={display} productId={productId} name={name} />
      </div>

      <div className={styles.propertiesLink}>
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
        <OrderQuantityHint productId={productId} className={styles.quantityHint} />

        {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <EffectivityDates productId={productId} />

        { hasNewServices && (
        <>
          <Availability
            state={!stock || stock.orderable
              ? AVAILABILITY_STATE_OK
              : AVAILABILITY_STATE_ALERT
            }
            text={i18n.text('product.available.not')}
            showWhenAvailable={false}
          />
          <StockInfoLists product={product} />
        </>
        )}

        <div className={styles.itemPrice}>
          <ItemPrice product={product} display={display} />
        </div>
      </div>
    </Link>
  );
};

ItemDetails.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

ItemDetails.defaultProps = {
  display: null,
};

export default ItemDetails;
