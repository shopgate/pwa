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
  i18n,
} from '@shopgate/engage/core';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import {
  Card,
  Link,
  TextLink,
  SurroundPortals,
  Typography,
  SafeHtml,
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
  FAVORITES_AVAILABILITY_TEXT,
} from '@shopgate/engage/favorites';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { VariantSelectSheet } from '@shopgate/engage/product/components';
import { makeStyles, responsiveMediaQuery, useMediaQuery } from '@shopgate/engage/styles';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import AddToCart from '@shopgate/pwa-ui-shared/AddToCartButton';
import { updateFavorite } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { openFavoritesCommentDialog } from '@shopgate/pwa-common-commerce/favorites/action-creators';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import Remove from '../RemoveButton';
import ItemCharacteristics from './ItemCharacteristics';
import ItemQuantity from './ItemQuantity';
import ItemNotes from './ItemNotes';
import {
  FAVORITES_LIST_ITEM,
  FAVORITES_NOTES,
  FAVORITES_QUANTITY,
} from '../../constants/Portals';

const EMPTY_CHARACTERISTICS = [];

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

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    display: 'flex',
    position: 'relative',
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  imageContainer: {
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
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoContainerRow: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  priceContainer: {
    minWidth: 100,
  },
  priceContainerInner: {
    display: 'inline-block',
    textAlign: 'right',
  },
  price: {
    justifyContent: 'flex-end',
  },
  priceInfo: {
    wordBreak: 'break-word',
    lineHeight: '0.875rem',
    padding: theme.spacing(0.5, 0),
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  titleContainer: {
    marginRight: 10,
    flex: 1,
  },
  removeContainer: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'flex-start',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    [`& .${classes.imageContainer}`]: {
      width: '100%',
      maxWidth: 'none',
      minWidth: 0,
      flex: 'none',
      marginRight: 0,
    },
    [`& .${classes.priceContainer}`]: {
      minWidth: 0,
    },
    [`& .${classes.priceContainerInner}`]: {
      textAlign: 'left',
    },
    [`& .${classes.price}`]: {
      justifyContent: 'flex-start',
    },
  },
  tileMedia: {
    position: 'relative',
  },
  tileRemove: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    [`& .${classes.removeContainer} button`]: {
      padding: theme.spacing(1),
      background: theme.palette.background.surface,
      boxShadow: theme.shadows[1],
    },
  },
  tileBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 1.5, 2),
  },
  tileFooter: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

/**
 * Favorite Item component
 * @return {JSX.Element}
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
}) => {
  const { classes, cx } = useStyles();
  const isWide = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [isDisabled, setIsDisabled] = useState(!isOrderable && !hasVariants);
  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [variantSheetMounted, setVariantSheetMounted] = useState(false);
  const [variantAddedCount, setVariantAddedCount] = useState(0);
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number' && specialPrice > defaultPrice;
  const characteristics = product?.characteristics ?? EMPTY_CHARACTERISTICS;
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
      if (!product.flags?.hasOptions) {
        setVariantSheetMounted(true);
        setVariantSheetOpen(true);
        return false;
      }

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

    if (hasNewServices() && isRopeProductOrderable === false) {
      // Product is explicitly not orderable for ROPE (a fulfillment method other than direct ship
      // that isn't available for the current product/location). Users need to correct the
      // selection on the PDP, so redirect. `null` means ROPE doesn't apply (direct ship) and must
      // fall through to the regular add-to-cart below.
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
    product.flags,
    product.id,
    productLink,
    showModal,
  ]);

  const handleVariantSheetAddToCart = useCallback((variant, variantQuantity) => {
    setVariantSheetOpen(false);
    broadcastLiveMessage('product.adding_item', {
      params: { count: variantQuantity },
    });

    const result = addToCart(null, variant, variantQuantity);
    Promise.resolve(result)
      .then(() => setVariantAddedCount(count => count + 1))
      .catch(() => {});

    return result;
  }, [addToCart]);

  const closeVariantSheet = useCallback(() => setVariantSheetOpen(false), []);

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
      price: defaultPrice,
      listId,
    };
  }, [characteristics, defaultPrice, listId, product]);

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

  const imageLink = (
    <Link
      className={cx(classes.imageContainer, 'engage__favorites__item__image-container')}
      component="div"
      href={productLink}
      aria-hidden
    >
      <ProductImage
        className={cx('engage__favorites__item__image')}
        src={product.featuredImageBaseUrl}
        context="list"
      />
    </Link>
  );

  const name = (
    <div className={classes.titleWrapper}>
      <SurroundPortals
        portalName={FAVORITES_PRODUCT_NAME}
        portalProps={commonPortalProps}
      >
        <TextLink
          href={productLink}
          tag="span"
          className={cx(classes.titleContainer, 'engage__favorites__item__title-container')}
        >
          <SafeHtml
            as={Typography}
            component="span"
            fontWeight="bold"
            html={product.name}
          />
        </TextLink>

      </SurroundPortals>
    </div>
  );

  const removeButton = (
    <div className={classes.removeContainer}>
      <Remove onClick={remove} />
    </div>
  );

  const availability = !hasNewServices() ? (
    <SurroundPortals
      portalName={FAVORITES_AVAILABILITY_TEXT}
      portalProps={commonPortalProps}
    >
      <AvailableText
        text={commonPortalProps.availability.text}
        state={commonPortalProps.availability.state}
        showWhenAvailable
        className={classes.availability}
      />
    </SurroundPortals>
  ) :
    (<StockInfoLists product={product} />);

  const quantityPicker = (
    <SurroundPortals portalName={FAVORITES_QUANTITY} portalProps={commonPortalProps}>
      <ItemQuantity
        quantity={internalQuantity}
        onChange={handleChangeQuantity}
        stepper={isWide}
      />
    </SurroundPortals>
  );

  const price = (
    <SurroundPortals
      portalName={FAVORITES_PRODUCT_PRICE}
      portalProps={commonPortalProps}
    >
      <div className={classes.priceContainer}>
        <div className={classes.priceContainerInner}>
          {hasStrikePrice ? (
            <PriceStriked
              value={specialPrice}
              currency={currency}
            />
          ) : null}
          <Price
            currency={currency}
            discounted={hasStrikePrice}
            unitPrice={defaultPrice}
            className={classes.price}
          />
        </div>
        <Typography variant="body2" component="div" color="textSecondary" className={classes.priceInfo}>
          <PriceInfo
            product={product}
            currency={currency}
            className={classes.priceInfo}
          />
        </Typography>
      </div>
    </SurroundPortals>
  );

  const addToCartButton = (
    <SurroundPortals portalName={FAVORITES_ADD_TO_CART} portalProps={ctaPortalProps}>
      <AddToCart
        onClick={handleAddToCart}
        isLoading={false}
        isDisabled={isDisabled}
        successCount={variantAddedCount}
        aria-label={i18n.text('product.add_to_cart')}
      />
    </SurroundPortals>
  );

  const variantSheet = hasVariants && variantSheetMounted && (
    <VariantSelectSheet
      productId={product.id}
      isOpen={variantSheetOpen}
      onClose={closeVariantSheet}
      onAddToCart={handleVariantSheetAddToCart}
      initialQuantity={quantity}
    />
  );

  const itemNotes = (
    <SurroundPortals portalName={FAVORITES_NOTES} portalProps={commonPortalProps}>
      <ItemNotes
        notes={notes}
        onClickDeleteComment={handleDeleteComment}
        onClickOpenComment={handleOpenComment}
        notesButtonRef={notesButtonRef}
      />
    </SurroundPortals>
  );

  return (
    <ProductListEntryProvider productId={product.id}>
      <SurroundPortals portalName={FAVORITES_LIST_ITEM} portalProps={product}>
        {isWide ? (
          <Card className={cx(classes.tile, 'engage__favorites__item')}>
            <div className={classes.tileMedia}>
              {imageLink}
              <div className={classes.tileRemove}>{removeButton}</div>
            </div>
            <div className={cx(classes.tileBody, 'engage__favorites__item__info-container')}>
              {name}
              <ItemCharacteristics characteristics={characteristics} />
              {availability}
              {quantityPicker}
              <div className={classes.tileFooter}>
                {price}
                {addToCartButton}
              </div>
              {variantSheet}
              {itemNotes}
            </div>
          </Card>
        ) : (
          <div className={cx(classes.root, 'engage__favorites__item')}>
            {imageLink}

            <div className={cx(classes.infoContainer, 'engage__favorites__item__info-container')}>
              <div className={classes.infoContainerRow}>
                {name}
                {removeButton}
              </div>
              <ItemCharacteristics characteristics={characteristics} />
              {availability}

              <div className={classes.infoContainerRow}>
                <div className={classes.quantityContainer}>
                  {quantityPicker}
                  {price}
                </div>
                {addToCartButton}
                {variantSheet}
              </div>
              {itemNotes}
            </div>
          </div>
        )}
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
};

FavoriteItem.defaultProps = {
  isBaseProduct: true,
  isOrderable: true,
  isRopeProductOrderable: true,
  hasVariants: false,
  notes: undefined,
  quantity: 1,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteItem);
