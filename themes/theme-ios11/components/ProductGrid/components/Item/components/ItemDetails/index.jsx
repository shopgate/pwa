import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Swatches,
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
  getProductRoute,
} from '@shopgate/engage/product';
import { hasNewServices as checkHasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { Availability, Link } from '@shopgate/engage/components';
import { StockInfoLists } from '@shopgate/engage/locations/components';
import { useNavigation } from '@shopgate/engage/core/hooks';
import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import * as styles from './style';
/**
 * The Product Grid Item Detail component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product.
 * @param {Object} props.display The display object.
 * @returns {JSX.Element}
 */
const ItemDetails = ({ product, display }) => {
  const { id: productId, name = null, stock = null } = product;

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
      {/*
        This feature is currently in BETA testing.
        It should only be used for approved BETA Client Projects
      */}
      <Swatches productId={productId} />

      <ItemName display={display} productId={productId} name={name} />

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
      It should only be used for approved BETA Client Projects */}
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

      <ItemPrice product={product} display={display} />
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
