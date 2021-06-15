import React, { Fragment } from 'react';
import classNames from 'classnames';
import {
  TextLink,
  ProductProperties,
  QuantityLabel,
  ConditionalWrapper,
  MessageBar,
} from '@shopgate/engage/components';
import {
  ProductImage,
  CartUnitQuantityPicker,
  PriceInfo,
  ProductName,
  ITEM_PATH,
} from '@shopgate/engage/product';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import { bin2hex } from '@shopgate/engage/core';
import { getLineItemActiveStatus } from '@shopgate/engage/orders';
import { CartContextMenuChangeFulfillment } from '@shopgate/engage/locations';
import CartItemProductPriceList from './CartItemProductPriceList';
import { CartItemProductLayoutWideRemoveItem } from './CartItemProductLayoutWideRemoveItem';
import { CartItemProductLayoutWideFulfillmentLabel } from './CartItemProductLayoutWideFulfillmentLabel';
import CartItemProductLayoutWideOrderDetails from './CartItemProductLayoutWideOrderDetails';
import { CartItemProductPriceCaption } from './CartItemProductPriceCaption';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import {
  container,
  containerInactive,
  imageColumn,
  detailsColumn,
  priceColumnWide,
  productName,
  productProperties,
  column,
  quantityPicker,
  quantityPickerDisabled,
  price,
  priceInfo,
  priceListEntry,
  priceListPromo,
  contextMenu,
  messageContainer,
  messageContainerRope,
} from './CartItemProductLayoutWide.style';

/**
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CartItemProductLayoutWide = () => {
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
    messages,
  } = context;

  const hasUnitWithDecimals = (product.unit && product.hasCatchWeight) || false;
  const isActive = !isOrderDetails
    ? true
    : getLineItemActiveStatus(cartItem?.status, cartItem?.subStatus);

  return (
    <Fragment>
      <div className={classNames(container, {
        [containerInactive]: !isActive,
      })}
      >
        <div className={imageColumn}>
          <ProductImage src={product.featuredImageBaseUrl || product.featuredImageUrl} />
        </div>
        <div className={detailsColumn}>
          <ConditionalWrapper
            condition={isEditable}
            wrapper={children =>
              <TextLink href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
                {children}
              </TextLink>
            }
          >
            <ProductName
              name={product.name}
              className={productName}
              portalName={CART_ITEM_NAME}
              portalProps={context}
              testId={product.name}
            />
          </ConditionalWrapper>

          <ProductProperties
            className={productProperties}
            properties={product.properties}
            lineClamp={2}
          />
          { !isOrderDetails && (
            <CartItemProductLayoutWideFulfillmentLabel />
          )}
        </div>
        <div className={cartHasLineItemPromotions ? priceColumnWide : column}>
          <CartItemProductPriceList
            cartItem={cartItem}
            classes={{
              price,
              priceStriked: price,
              entry: priceListEntry,
              promo: priceListPromo,
            }}
          />
          <PriceInfo product={product} currency={currency} className={priceInfo} />
          <CartItemProductPriceCaption />
        </div>
        { isOrderDetails && (
          <CartItemProductLayoutWideOrderDetails />
        )}
        <div className={column}>
          { isEditable ? (
            <CartUnitQuantityPicker
              productId={product.id}
              value={isOrderDetails ? cartItem.orderedQuantity : cartItem.quantity}
              unit={product.unit}
              hasCatchWeight={product.hasCatchWeight}
              onChange={handleUpdate}
              classNames={{
                withDecimals: quantityPicker,
                withoutDecimals: quantityPicker,
              }}
            />
          ) : (
            <QuantityLabel
              className={quantityPickerDisabled}
              value={isOrderDetails ? cartItem.orderedQuantity : cartItem.quantity}
              unit={hasUnitWithDecimals ? product.unit : null}
              maxDecimals={hasUnitWithDecimals ? 2 : 0}
            />
          )}
          { isEditable && (
            <CartItemProductLayoutWideRemoveItem />
          )}
        </div>
        <div className={column}>
          <CartItemProductPriceList
            isSubtotal
            cartItem={cartItem}
            classes={{
              price,
              priceStriked: price,
              entry: priceListEntry,
              promo: priceListPromo,
            }}
          />
          <CartItemProductPriceCaption />
        </div>
        { isEditable && merchantFulfillmentMethodsCount > 1 && (
          <div className={contextMenu}>
            <CartContextMenuChangeFulfillment cartItem={cartItem} />
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <MessageBar
          messages={messages}
          showIcons
          classNames={{
            container: cartItem.fulfillment ? messageContainerRope : messageContainer,
          }}
        />
      )}
    </Fragment>
  );
};

export { CartItemProductLayoutWide };
