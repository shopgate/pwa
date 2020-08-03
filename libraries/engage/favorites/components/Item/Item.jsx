import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { ProductImage, ITEM_PATH } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/engage/core';
import { Link } from '@shopgate/engage/components';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import Remove from '../RemoveButton';

const styles = {
  root: css({
    display: 'flex',
    position: 'relative',
    '&:not(:last-child)': {
      marginBottom: 48,
    },
    '&:last-child': {
      marginBottom: 16,
    },
  }).toString(),
  imageContainer: css({
    flex: 0.4,
    marginRight: 18,
  }).toString(),
  infoContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  }),
  innerInfoContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    minWidth: 0,
  }),
  infoContainerLeft: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  }),
  infoContainerRight: css({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    marginLeft: 8,
  }),
  title: css({
    fontSize: 17,
    color: 'var(--color-text-high-emphasis)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: 10,
  }),
  property: css({
    fontSize: 14,
    color: 'var(--color-text-low-emphasis)',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  actions: css({
    position: 'absolute',
    bottom: -24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 90,
  }).toString(),
};

/**
 * Favorite Item component
 * @return {JSX}
 */
const FavoriteItem = ({ product, remove }) => {
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number';
  const price = hasStrikePrice ? specialPrice : defaultPrice;

  return (
    <Link
      className={styles.root}
      component="div"
      href={`${ITEM_PATH}/${bin2hex(product.id)}`}
    >
      <div className={styles.imageContainer}>
        <ProductImage src={product.featuredImageUrl} />
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.title}>{product.name}</span>
        <div className={styles.innerInfoContainer}>
          <div className={styles.infoContainerLeft}>
            {product
              .properties
              ?.filter(property => property.type === 'attribute')
              .slice(0, 2)
              .map(property => (
                <span key={property.code || property.label} className={styles.property}>
                  {`${property.label}: ${property.value}`}
                </span>
              ))}
          </div>
          <div className={styles.infoContainerRight}>
            {hasStrikePrice ? (
              <PriceStriked
                value={defaultPrice}
                currency={currency}
              />
            ) : null}
            <Price
              currency={currency}
              discounted={hasStrikePrice}
              taxDisclaimer
              unitPrice={price}
            />
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Remove onClick={remove} />
        <AddToCart />
      </div>
    </Link>
  );
};

FavoriteItem.propTypes = {
  product: PropTypes.shape().isRequired,
  remove: PropTypes.func.isRequired,
};

export default FavoriteItem;
