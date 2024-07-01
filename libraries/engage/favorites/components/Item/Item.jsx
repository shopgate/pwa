import React, {
  useCallback,
  useMemo,
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
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
  ProductListEntryProvider,
} from '@shopgate/engage/product';
import {
  bin2hex,
  showModal as showModalAction,
  historyPush as historyPushAction,
  getThemeSettings,
  i18n,
} from '@shopgate/engage/core';
import { makeGetSupportsFulfillmentSelectors } from '@shopgate/engage/core/config';
import {
  Link,
  TextLink,
  SurroundPortals,
} from '@shopgate/engage/components';
import {
  makeIsRopeProductOrderable,
  getPreferredLocation,
  StockInfoLists,
} from '@shopgate/engage/locations';
import {
  FAVORITES_PRODUCT_NAME,
  FAVORITES_PRODUCT_PRICE,
  FAVORITES_ADD_TO_CART,
} from '@shopgate/engage/favorites';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { updateFavorite } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { openFavoritesCommentDialog } from '@shopgate/pwa-common-commerce/favorites/action-creators';
import classNames from 'classnames';
import Remove from '../RemoveButton';
import ItemCharacteristics from './ItemCharacteristics';
import ItemQuantity from './ItemQuantity';
import ItemNotes from './ItemNotes';
import {
  FAVORITES_LIST_ITEM,
  FAVORITES_NOTES,
  FAVORITES_QUANTITY,
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
  const getSupportsFulfillmentSelectors = makeGetSupportsFulfillmentSelectors();

  return (state, props) => ({
    isBaseProduct: isBaseProductSelector(state, props),
    hasVariants: hasProductVariants(state, props),
    isOrderable: isProductOrderable(state, props),
    isRopeProductOrderable: isRopeProductOrderable(state, props),
    supportsFulfillmentSelectors: getSupportsFulfillmentSelectors(state, props),
  });
};

/**
 * @param {Function} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  showModal: (...args) => dispatch(showModalAction(...args)),
  historyPush: (...args) => dispatch(historyPushAction(...args)),
  updateFavoriteItem: (productId, listId, quantity, notes) => {
    dispatch(updateFavorite(productId, listId, quantity, notes));
  },
  openCommentDialog: (productId, listId) => dispatch(openFavoritesCommentDialog(productId, listId)),
});

const styles = {
  root: css({
    display: 'flex',
    position: 'relative',
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  }).toString(),
  imageContainer: css({
    flex: 0.4,
    marginRight: 18,
    [responsiveMediaQuery('>=xs', { appAlways: true })]: {
      maxWidth: 120,
      minWidth: 80,
    },
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      maxWidth: 120,
      minWidth: 80,
    },
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      width: 120,
      flex: 'none',
    },
  }).toString(),
  infoContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 8,
  }).toString(),
  infoContainerRow: css({
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  }).toString(),
  quantityContainer: css({
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  }).toString(),
  priceContainer: css({
    minWidth: 100,
  }).toString(),
  priceInfo: css({
    wordBreak: 'break-word',
    fontSize: '0.875rem',
    lineHeight: '0.875rem',
    color: 'var(--color-text-low-emphasis)',
    padding: `${variables.gap.xsmall}px 0`,
  }).toString(),
  titleWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }).toString(),
  titleContainer: css({
    marginRight: 10,
    flex: 1,
  }).toString(),
  title: css({
    fontSize: 17,

    fontWeight: 600,
  }).toString(),
  removeContainer: css({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'flex-start',
  }),
};

/**
 * Favorite Item component
 * @return {JSX}
 */
const FavoriteItem = ({
  listId,
  product,
  notes,
  quantity,
  remove,
  addToCart,
  isBaseProduct,
  isOrderable,
  isRopeProductOrderable,
  hasVariants,
  showModal,
  historyPush,
  updateFavoriteItem,
  openCommentDialog,
  supportsFulfillmentSelectors,
}) => {
  const { ListImage: gridResolutions } = getThemeSettings('AppImages') || {};
  const [isDisabled, setIsDisabled] = useState(!isOrderable && !hasVariants);
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number' && specialPrice > 0 && specialPrice > defaultPrice;
  const price = hasStrikePrice ? specialPrice : defaultPrice;
  const characteristics = product?.characteristics || [];
  const productLink = `${ITEM_PATH}/${bin2hex(product.id)}`;

  const notesButtonRef = useRef();

  const [internalQuantity, setInternalQuantity] = useState(quantity);

  useEffect(() => {
    setInternalQuantity(quantity);
  }, [quantity]);

  useLayoutEffect(() => {
    setIsDisabled(!isOrderable && !hasVariants);
  }, [hasVariants, isOrderable]);

  const handleOpenComment = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    openCommentDialog(product.id, listId);
  }, [listId, openCommentDialog, product.id]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBaseProduct && hasVariants) {
      // Called for a parent product. User needs to confirm the navigation to the PDP
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

    if (supportsFulfillmentSelectors && !isRopeProductOrderable) {
      // Product is not orderable for ROPE. So users need to do some corrections. Just redirect.
      historyPush({ pathname: productLink });
      return false;
    }

    broadcastLiveMessage('product.adding_item', {
      params: { count: 1 },
    });

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
    supportsFulfillmentSelectors,
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

  const handleChangeQuantity = useCallback((newQuantity) => {
    // Do nothing when quantity didn't change
    if (newQuantity === quantity) return;

    updateFavoriteItem(
      product.id,
      listId,
      newQuantity,
      notes
    );
  }, [listId, notes, product.id, quantity, updateFavoriteItem]);

  const handleDeleteComment = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    updateFavoriteItem(product.id, listId, quantity, '');

    setTimeout(() => {
      if (notesButtonRef?.current) {
        // Focus the add button after item deletion to improve a11y
        notesButtonRef.current.focus();
      }

      broadcastLiveMessage('favorites.comments.removed');
    }, 300);
  }, [listId, product.id, quantity, updateFavoriteItem]);

  return (
    <ProductListEntryProvider productId={product.id}>
      <SurroundPortals portalName={FAVORITES_LIST_ITEM} portalProps={product}>
        <div className={styles.root}>
          <Link
            className={styles.imageContainer}
            component="div"
            href={productLink}
            aria-hidden
          >
            <ProductImage src={product.featuredImageBaseUrl} resolutions={gridResolutions} />
          </Link>

          <div className={styles.infoContainer}>
            <div className={classNames(styles.infoContainerRow)}>
              <div className={styles.titleWrapper}>
                <SurroundPortals
                  portalName={FAVORITES_PRODUCT_NAME}
                  portalProps={commonPortalProps}
                >
                  <TextLink
                    href={productLink}
                    tag="span"
                    className={styles.titleContainer}
                  >
                    <span
                      className={styles.title}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: `${product.name}` }}
                    />
                  </TextLink>

                </SurroundPortals>
              </div>
              <div className={styles.removeContainer}>
                <Remove onClick={remove} />
              </div>
            </div>
            <ItemCharacteristics characteristics={characteristics} />
            <StockInfoLists product={product} />
            <div className={styles.infoContainerRow}>
              <div className={styles.quantityContainer}>
                <SurroundPortals portalName={FAVORITES_QUANTITY} portalProps={commonPortalProps}>
                  <ItemQuantity quantity={internalQuantity} onChange={handleChangeQuantity} />
                </SurroundPortals>
                <SurroundPortals
                  portalName={FAVORITES_PRODUCT_PRICE}
                  portalProps={commonPortalProps}
                >
                  <div className={styles.priceContainer}>
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
                </SurroundPortals>
              </div>
              <SurroundPortals portalName={FAVORITES_ADD_TO_CART} portalProps={ctaPortalProps}>
                <AddToCart
                  onClick={handleAddToCart}
                  isLoading={false}
                  isDisabled={isDisabled}
                  aria-label={i18n.text('product.add_to_cart')}
                />
              </SurroundPortals>
            </div>
            <SurroundPortals portalName={FAVORITES_NOTES} portalProps={commonPortalProps}>
              <ItemNotes
                notes={notes}
                onClickDeleteComment={handleDeleteComment}
                onClickOpenComment={handleOpenComment}
                notesButtonRef={notesButtonRef}
              />
            </SurroundPortals>
          </div>
        </div>
      </SurroundPortals>
    </ProductListEntryProvider>
  );
};

FavoriteItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
  listId: PropTypes.string.isRequired,
  openCommentDialog: PropTypes.func.isRequired,
  product: PropTypes.shape().isRequired,
  remove: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  updateFavoriteItem: PropTypes.func.isRequired,
  hasVariants: PropTypes.bool,
  isBaseProduct: PropTypes.bool,
  isOrderable: PropTypes.bool,
  isRopeProductOrderable: PropTypes.bool,
  notes: PropTypes.string,
  quantity: PropTypes.number,
  supportsFulfillmentSelectors: PropTypes.bool,
};

FavoriteItem.defaultProps = {
  isBaseProduct: true,
  isOrderable: true,
  isRopeProductOrderable: true,
  hasVariants: false,
  notes: undefined,
  quantity: 1,
  supportsFulfillmentSelectors: false,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteItem);
