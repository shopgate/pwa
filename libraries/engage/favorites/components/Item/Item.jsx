import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { ProductImage, ITEM_PATH, PriceInfo } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/engage/core';
import { ResponsiveContainer, Link, SurroundPortals } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Remove from '../RemoveButton';
import ItemCharacteristics from './ItemCharacteristics';
import { FAVORITES_LIST_ITEM, FAVORITES_LIST_ITEM_ACTIONS } from '../../constants/Portals';

const { variables } = themeConfig;

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
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      width: 120,
      flex: 'none',
    },
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
    alignItems: 'flex-end',
  }),
  priceInfo: css({
    wordBreak: 'break-word',
    fontSize: '0.875rem',
    lineHeight: '0.875rem',
    color: 'var(--color-text-low-emphasis)',
    padding: `${variables.gap.xsmall}px 0`,
  }).toString(),
  title: css({
    fontSize: 17,
    color: 'var(--color-text-high-emphasis)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: 10,
  }),
  actions: css({
    [responsiveMediaQuery('<md', { appAlways: true })]: {
      position: 'absolute',
      bottom: -24,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 90,
    },
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      display: 'flex',
      flexDirection: 'row',
      width: 100,
      justifyContent: 'space-between',
      marginLeft: 64,
    },
  }).toString(),
};

/**
 * Favorite Item component
 * @return {JSX}
 */
const FavoriteItem = ({ product, remove, addToCart }) => {
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number';
  const price = hasStrikePrice ? specialPrice : defaultPrice;
  const characteristics = product?.characteristics || [];

  return (
    <SurroundPortals portalName={FAVORITES_LIST_ITEM} portalProps={product}>
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
              <ItemCharacteristics characteristics={characteristics} />
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
              <PriceInfo product={product} currency={currency} className={styles.priceInfo} />
            </div>
            <ResponsiveContainer breakpoint=">=md" webOnly>
              <div className={styles.actions}>
                <SurroundPortals portalName={FAVORITES_LIST_ITEM_ACTIONS}>
                  <Remove onClick={remove} />
                  <AddToCart onClick={addToCart} isLoading={false} isDisabled={false} />
                </SurroundPortals>
              </div>
            </ResponsiveContainer>
          </div>
        </div>
        <ResponsiveContainer breakpoint="<md" appAlways>
          <div className={styles.actions}>
            <SurroundPortals portalName={FAVORITES_LIST_ITEM_ACTIONS}>
              <Remove onClick={remove} />
              <AddToCart onClick={addToCart} isLoading={false} isDisabled={false} />
            </SurroundPortals>
          </div>
        </ResponsiveContainer>
      </Link>
    </SurroundPortals>
  );
};

FavoriteItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  product: PropTypes.shape().isRequired,
  remove: PropTypes.func.isRequired,
};

export default FavoriteItem;
