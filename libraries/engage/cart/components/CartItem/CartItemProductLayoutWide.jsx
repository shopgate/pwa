import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import {
  TextLink,
  ProductProperties,
  QuantityLabel,
  ConditionalWrapper,
  MessageBar,
  SurroundPortals,
} from '@shopgate/engage/components';
import {
  ProductImage,
  CartUnitQuantityPicker,
  PriceInfo,
  ProductName,
  ITEM_PATH,
} from '@shopgate/engage/product';
import { CART_ITEM_NAME, CART_ITEM_QUANTITY_PICKER } from '@shopgate/pwa-common-commerce/cart';
import { bin2hex } from '@shopgate/engage/core';
import { getLineItemActiveStatus } from '@shopgate/engage/orders';
import { CartContextMenuChangeFulfillment } from '@shopgate/engage/locations';
import CartItemProductPriceList from './CartItemProductPriceList';
import { CartItemProductLayoutWideRemoveItem } from './CartItemProductLayoutWideRemoveItem';
import { CartItemProductLayoutWideFulfillmentLabel } from './CartItemProductLayoutWideFulfillmentLabel';
import CartItemProductLayoutWideOrderDetails from './CartItemProductLayoutWideOrderDetails';
import { CartItemProductPriceCaption } from './CartItemProductPriceCaption';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()((theme, _params, classes) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  imageColumn: {
    width: 120,
    height: 120,
    marginRight: theme.spacing(1),
    flexShrink: 0,
    flexGrow: 0,
  },
  column: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
  },
  detailsColumn: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 3,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
  },
  priceColumnWide: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 4,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
  },
  productName: {
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
    fontWeight: 500,
    wordBreak: ['keep-all', 'break-word'],
    hyphens: 'auto',
  },
  productProperties: {
    paddingTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '1rem',
  },
  quantityPicker: {
    width: 140,
  },
  quantityPickerDisabled: {
    padding: theme.spacing(0, 1),
    textAlign: 'center',
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
    height: 28,
    width: '100%',
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
  },
  containerInactive: {
    color: theme.palette.text.secondary,
    [` .${classes.quantityPickerDisabled}`]: {
      color: theme.palette.text.secondary,
    },
    [` .${classes.imageColumn}`]: {
      opacity: 0.7,
    },
  },
  price: {
    fontSize: '1.25rem !important',
    lineHeight: '1.625rem  !important',
  },
  priceListEntry: {
    flexDirection: 'column-reverse !important',
  },
  priceListPromo: {
    paddingRight: 0,
    alignSelf: 'flex-end',
  },
  priceInfo: {
    wordBreak: 'break-word',
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5, 0),
  },
  contextMenu: {
    marginTop: theme.spacing(-1.5),
    marginRight: theme.spacing(-2),
  },
  messageContainer: {
    marginTop: 0,
  },
  messageContainerRope: {
    marginTop: 0,
    marginBottom: 0,
  },
}));

/**
 * @returns {JSX}
 */
const CartItemProductLayoutWide = () => {
  const { classes } = useStyles();
  const {
    merchantFulfillmentMethodsCount, isOrderDetails, cartHasLineItemPromotions,
  } = useCartItem();
  const context = useCartItemProduct();
  const {
    cartItem,
    product,
    currency,
    handleUpdate,
    isEditable,
    isLinkable,
    allowQuantityChange,
    messages,
  } = context;

  const hasUnitWithDecimals = (product.unit && product.hasCatchWeight) || false;
  const isActive = !isOrderDetails
    ? true
    : getLineItemActiveStatus(cartItem?.status, cartItem?.subStatus);

  return (
    <>
      <div className={classNames(classes.container, {
        [classes.containerInactive]: !isActive,
      })}
      >
        <div className={classes.imageColumn}>
          <ProductImage src={product.featuredImageBaseUrl || product.featuredImageUrl} />
        </div>
        <div className={classes.detailsColumn}>
          <ConditionalWrapper
            condition={isEditable && isLinkable}
            wrapper={children =>
              <TextLink href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
                {children}
              </TextLink>}
          >
            <ProductName
              name={product.name}
              className={classes.productName}
              portalName={CART_ITEM_NAME}
              portalProps={context}
              testId={product.name}
            />
          </ConditionalWrapper>

          <ProductProperties
            className={classes.productProperties}
            properties={product.properties}
            lineClamp={2}
          />
          { !isOrderDetails && (
            <CartItemProductLayoutWideFulfillmentLabel />
          )}
        </div>
        <div className={cartHasLineItemPromotions ? classes.priceColumnWide : classes.column}>
          <CartItemProductPriceList
            cartItem={cartItem}
            classes={{
              price: classes.price,
              priceStriked: classes.price,
              entry: classes.priceListEntry,
              promo: classes.priceListPromo,
            }}
          />
          <PriceInfo product={product} currency={currency} className={classes.priceInfo} />
          <CartItemProductPriceCaption />
        </div>
        { isOrderDetails && (
          <CartItemProductLayoutWideOrderDetails />
        )}
        <div className={classes.column}>
          { isEditable && allowQuantityChange ? (
            <SurroundPortals
              portalName={CART_ITEM_QUANTITY_PICKER}
              portalProps={{
                product,
                cartItem,
                isOrderDetails,
                handleUpdate,
                isEditable,
              }}
            >
              <CartUnitQuantityPicker
                productId={product.id}
                value={isOrderDetails ? cartItem.orderedQuantity : cartItem.quantity}
                unit={product.unit}
                hasCatchWeight={product.hasCatchWeight}
                onChange={handleUpdate}
                classNames={{
                  withDecimals: classes.quantityPicker,
                  withoutDecimals: classes.quantityPicker,
                }}
              />
            </SurroundPortals>
          ) : (
            <QuantityLabel
              className={classes.quantityPickerDisabled}
              value={isOrderDetails ? cartItem.orderedQuantity : cartItem.quantity}
              unit={hasUnitWithDecimals ? product.unit : null}
              maxDecimals={hasUnitWithDecimals ? 2 : 0}
            />
          )}
          { isEditable && (
            <CartItemProductLayoutWideRemoveItem />
          )}
        </div>
        <div className={classes.column}>
          <CartItemProductPriceList
            isSubtotal
            cartItem={cartItem}
            classes={{
              price: classes.price,
              priceStriked: classes.price,
              entry: classes.priceListEntry,
              promo: classes.priceListPromo,
            }}
          />
          <CartItemProductPriceCaption />
        </div>
        { isEditable && merchantFulfillmentMethodsCount > 1 && (
          <div className={classes.contextMenu}>
            <CartContextMenuChangeFulfillment cartItem={cartItem} />
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <MessageBar
          messages={messages}
          showIcons
          classNames={{
            container: cartItem.fulfillment
              ? classes.messageContainerRope
              : classes.messageContainer,
          }}
        />
      )}
    </>
  );
};

export { CartItemProductLayoutWide };
