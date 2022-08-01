import React, {
  useCallback, useMemo, useLayoutEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import classNames from 'classnames';
import { MODAL_VARIANT_SELECT } from '@shopgate/pwa-ui-shared/Dialog/constants';
import {
  ProductImage,
  ITEM_PATH,
  isBaseProduct as isBaseProductSelector,
  isProductOrderable,
  hasProductVariants,
} from '@shopgate/engage/product';
import {
  bin2hex,
  showModal as showModalAction,
  historyPush as historyPushAction,
  getThemeSettings,
  i18n,
} from '@shopgate/engage/core';
import { Link, SurroundPortals } from '@shopgate/engage/components';
import {
  FAVORITES_PRODUCT_NAME,
  FAVORITES_PRODUCT_PRICE,
  FAVORITES_ADD_TO_CART,
} from '@shopgate/engage/favorites';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import Remove from '../RemoveButton';
import ItemCharacteristics from './ItemCharacteristics';
import {
  FAVORITES_LIST_ITEM,
  FAVORITES_LIST_ITEM_ACTIONS,
  FAVORITES_AVAILABILITY_TEXT,
} from '../../constants/Portals';

/**
 * The extended component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => ({
  isBaseProduct: isBaseProductSelector(state, props),
  hasVariants: hasProductVariants(state, props),
  isOrderable: isProductOrderable(state, props),
});

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
  }).toString(),
  infoContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  }).toString(),
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
  infoContainerRightTaxDisclaimer: css({
    marginRight: 8,
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
  actions: css({
    position: 'absolute',
    bottom: -24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 90,
  }).toString(),
  basePrice: css({
    fontSize: '0.6875rem',
    textAlign: 'right',
  }).toString(),
  availability: css({
    fontSize: 14,
    fontWeight: 400,
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
  hasVariants,
  showModal,
}) => {
  const { ListImage: gridResolutions } = getThemeSettings('AppImages') || {};
  const [isDisabled, setIsDisabled] = useState(!isOrderable && !hasVariants);
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = product.price?.discount > 0;
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

    return addToCart(e);
  }, [
    addToCart,
    hasVariants,
    isBaseProduct,
    product.id,
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
      listId,
    };
  }, [characteristics, listId, product]);

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

  const taxDisclaimer = false;

  const priceClassNames = classNames(
    styles.infoContainerRight,
    { [styles.infoContainerRightTaxDisclaimer]: taxDisclaimer }
  );

  return (
    <SurroundPortals portalName={FAVORITES_LIST_ITEM} portalProps={product}>
      <div className={styles.root}>
        <Link
          className={styles.imageContainer}
          component="div"
          href={productLink}
        >
          <ProductImage src={product.featuredImageBaseUrl} resolutions={gridResolutions} />
        </Link>
        <Link
          className={styles.infoContainer}
          component="div"
          href={productLink}
        >
          <SurroundPortals portalName={FAVORITES_PRODUCT_NAME} portalProps={commonPortalProps}>
            <span className={styles.title}>{product.name}</span>
          </SurroundPortals>
          <div className={styles.innerInfoContainer}>
            <div className={styles.infoContainerLeft}>
              <ItemCharacteristics characteristics={characteristics} />
              <SurroundPortals
                portalName={FAVORITES_AVAILABILITY_TEXT}
                portalProps={commonPortalProps}
              >
                <AvailableText
                  text={commonPortalProps.availability.text}
                  state={commonPortalProps.availability.state}
                  showWhenAvailable
                  className={styles.availability}
                />
              </SurroundPortals>
            </div>
            <div className={priceClassNames}>
              <SurroundPortals portalName={FAVORITES_PRODUCT_PRICE} portalProps={commonPortalProps}>
                {hasStrikePrice ? (
                  <PriceStriked
                    value={specialPrice}
                    currency={currency}
                  />
                ) : null}
                <Price
                  currency={currency}
                  discounted={hasStrikePrice}
                  taxDisclaimer={taxDisclaimer}
                  unitPrice={defaultPrice}
                />
                {!!product.price.info && (
                  <PriceInfo text={product.price.info} className={styles.basePrice} />
                )}
              </SurroundPortals>
            </div>
          </div>
        </Link>
        <div className={styles.actions}>
          <SurroundPortals portalName={FAVORITES_LIST_ITEM_ACTIONS} portalProps={ctaPortalProps}>
            <Remove onClick={remove} />
            <SurroundPortals portalName={FAVORITES_ADD_TO_CART} portalProps={ctaPortalProps}>
              <AddToCart
                onClick={handleAddToCart}
                isLoading={false}
                isDisabled={isDisabled}
                aria-label={i18n.text('product.add_to_cart')}
              />
            </SurroundPortals>
          </SurroundPortals>
        </div>
      </div>
    </SurroundPortals>
  );
};

FavoriteItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  listId: PropTypes.string.isRequired,
  product: PropTypes.shape().isRequired,
  remove: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hasVariants: PropTypes.bool,
  isBaseProduct: PropTypes.bool,
  isOrderable: PropTypes.bool,
};

FavoriteItem.defaultProps = {
  isBaseProduct: true,
  isOrderable: true,
  hasVariants: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteItem);
