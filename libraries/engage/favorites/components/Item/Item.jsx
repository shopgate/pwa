import React, {
  useCallback, useMemo, useLayoutEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { MODAL_VARIANT_SELECT } from '@shopgate/pwa-ui-shared/Dialog/constants';
import {
  ProductImage,
  ITEM_PATH,
  PriceInfo,
  isBaseProduct as isBaseProductSelector,
  isProductOrderable,
  hasProductVariants,
} from '@shopgate/engage/product';
import {
  bin2hex,
  showModal as showModalAction,
  historyPush as historyPushAction,
} from '@shopgate/engage/core';
import { ResponsiveContainer, Link, SurroundPortals } from '@shopgate/engage/components';
import { makeIsRopeProductOrderable, getPreferredLocation } from '@shopgate/engage/locations';
import {
  FAVORITES_PRODUCT_NAME,
  FAVORITES_PRODUCT_PRICE,
  FAVORITES_ADD_TO_CART,
} from '@shopgate/engage/favorites';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Remove from '../RemoveButton';
import ItemCharacteristics from './ItemCharacteristics';
import {
  FAVORITES_LIST_ITEM,
  FAVORITES_LIST_ITEM_ACTIONS,
} from '../../constants/Portals';

const { variables } = themeConfig;

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const isRopeProductOrderable = makeIsRopeProductOrderable(
    (state, props) => getPreferredLocation(state, props)?.code,
    (state, props) => props.variantId || props.productId || null
  );

  return (state, props) => ({
    isBaseProduct: isBaseProductSelector(state, props),
    hasVariants: hasProductVariants(state, props),
    isOrderable: isProductOrderable(state, props),
    isRopeProductOrderable: isRopeProductOrderable(state, props),
  });
};

const mapDispatchToProps = {
  showModal: showModalAction,
  historyPush: historyPushAction,
};

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
const FavoriteItem = ({
  listId,
  product,
  remove,
  addToCart,
  isBaseProduct,
  isOrderable,
  isRopeProductOrderable,
  hasVariants,
  showModal,
  historyPush,
}) => {
  const [isDisabled, setIsDisabled] = useState(!isOrderable && !hasVariants);
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number';
  const price = hasStrikePrice ? specialPrice : defaultPrice;
  const characteristics = product?.characteristics || [];
  const productLink = `${ITEM_PATH}/${bin2hex(product.id)}`;

  useLayoutEffect(() => {
    setIsDisabled(!isOrderable && !hasVariants);
  }, [hasVariants, isOrderable]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBaseProduct && hasVariants) {
      // Called for a parent product. Users needs to confirm the navigation to the PDP
      showModal({
        title: null,
        type: MODAL_VARIANT_SELECT,
        message: 'favorites.modal.message',
        confirm: 'favorites.modal.confirm',
        dismiss: 'common.cancel',
        params: {
          productId: product.id,
        },
      });
      return false;
    }

    if (!isRopeProductOrderable) {
      // Product is not orderable for ROPE. So users need to do some corrections. Just redirect.
      historyPush({ pathname: productLink });
      return false;
    }

    return addToCart(e);
  }, [
    addToCart,
    hasVariants,
    historyPush,
    isBaseProduct,
    isRopeProductOrderable,
    product.id,
    productLink,
    showModal,
  ]);

  const commonPortalProps = useMemo(() => {
    const {
      availability,
      id,
      name,
    } = product;
    return {
      availability,
      characteristics,
      id,
      name,
      price,
      listId,
    };
  }, [characteristics, listId, price, product]);

  const ctaPortalProps = useMemo(() => ({
    isLoading: false,
    noShadow: false,
    listId,
    isBaseProduct,
    isDisabled,
    productId: product.id,
    handleRemoveFromCart: remove,
    handleAddToCart,
  }), [handleAddToCart, isBaseProduct, isDisabled, listId, product.id, remove]);

  return (
    <SurroundPortals portalName={FAVORITES_LIST_ITEM} portalProps={product}>
      <Link
        className={styles.root}
        component="div"
        href={productLink}
      >
        <div className={styles.imageContainer}>
          <ProductImage src={product.featuredImageUrl} />
        </div>
        <div className={styles.infoContainer}>
          <SurroundPortals portalName={FAVORITES_PRODUCT_NAME} portalProps={commonPortalProps}>
            <span className={styles.title}>{product.name}</span>
          </SurroundPortals>
          <div className={styles.innerInfoContainer}>
            <div className={styles.infoContainerLeft}>
              <ItemCharacteristics characteristics={characteristics} />
            </div>
            <div className={styles.infoContainerRight}>
              <SurroundPortals portalName={FAVORITES_PRODUCT_PRICE} portalProps={commonPortalProps}>
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
              </SurroundPortals>
            </div>
            <ResponsiveContainer breakpoint=">=md" webOnly>
              <div className={styles.actions}>
                <SurroundPortals
                  portalName={FAVORITES_LIST_ITEM_ACTIONS}
                  portalProps={ctaPortalProps}
                >
                  <Remove onClick={remove} />
                  <SurroundPortals portalName={FAVORITES_ADD_TO_CART} portalProps={ctaPortalProps}>
                    <AddToCart
                      onClick={handleAddToCart}
                      isLoading={false}
                      isDisabled={isDisabled}
                    />
                  </SurroundPortals>
                </SurroundPortals>
              </div>
            </ResponsiveContainer>
          </div>
        </div>
        <ResponsiveContainer breakpoint="<md" appAlways>
          <div className={styles.actions}>
            <SurroundPortals portalName={FAVORITES_LIST_ITEM_ACTIONS} portalProps={ctaPortalProps}>
              <Remove onClick={remove} />
              <SurroundPortals portalName={FAVORITES_ADD_TO_CART} portalProps={ctaPortalProps}>
                <AddToCart
                  onClick={handleAddToCart}
                  isLoading={false}
                  isDisabled={isDisabled}
                />
              </SurroundPortals>
            </SurroundPortals>
          </div>
        </ResponsiveContainer>
      </Link>
    </SurroundPortals>
  );
};

FavoriteItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
  listId: PropTypes.string.isRequired,
  product: PropTypes.shape().isRequired,
  remove: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hasVariants: PropTypes.bool,
  isBaseProduct: PropTypes.bool,
  isOrderable: PropTypes.bool,
  isRopeProductOrderable: PropTypes.bool,
};

FavoriteItem.defaultProps = {
  isBaseProduct: true,
  isOrderable: true,
  isRopeProductOrderable: true,
  hasVariants: false,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteItem);
