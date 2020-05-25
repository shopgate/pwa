import React, { Fragment } from 'react';
import {
  TextLink,
  SurroundPortals,
  ProductProperties,
  Ellipsis,
  QuantityInput,
  ConditionalWrapper,
  PriceInfo,
  MessageBar,
} from '@shopgate/engage/components';
import {
  ProductImage,
  CartUnitQuantityPicker,
  ITEM_PATH,
  PRODUCT_UNIT_EACH,
} from '@shopgate/engage/product';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import { bin2hex } from '@shopgate/engage/core';
import { CartContextMenuChangeFulfillment } from '@shopgate/engage/locations';
import { CartItemProductPrice } from './CartItemProductPrice';
import { CartItemProductLayoutWideRemoveItem } from './CartItemProductLayoutWideRemoveItem';
import { CartItemProductLayoutWideFulfillmentLabel } from './CartItemProductLayoutWideFulfillmentLabel';
import { CartItemProductPriceCaption } from './CartItemProductPriceCaption';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import {
  container,
  imageColumn,
  detailsColumn,
  productName,
  productProperties,
  column,
  quantityPicker,
  quantityPickerDisabled,
  price,
  priceInfo,
  contextMenu,
  messageContainer,
  messageContainerRope,
} from './CartItemProductLayoutWide.style';

/**
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CartItemProductLayoutWide = () => {
  const { merchantFulfillmentMethodsCount } = useCartItem();
  const context = useCartItemProduct();
  const {
    cartItem,
    product,
    currency,
    handleUpdate,
    isEditable,
    messages,
  } = context;

  const hasUnitWithDecimals = product.unit && product.unit !== PRODUCT_UNIT_EACH;

  return (
    <Fragment>
      <div className={container}>
        <div className={imageColumn}>
          <ProductImage src={product.featuredImageUrl} />
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
            <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
              <Ellipsis>
                <div
                  className={productName}
                  data-test-id={product.name}
                  dangerouslySetInnerHTML={{ __html: product.name }}
                />
              </Ellipsis>
            </SurroundPortals>
          </ConditionalWrapper>

          <ProductProperties
            className={productProperties}
            properties={product.properties}
            lineClamp={2}
          />
          <CartItemProductLayoutWideFulfillmentLabel />
        </div>
        <div className={column}>
          <CartItemProductPrice
            defaultPrice={product.price.unit}
            specialPrice={product.price.unitSpecial}
            classNames={{
              price,
              priceStriked: price,
            }}
          />
          {product.price.info && (
            <PriceInfo className={priceInfo} text={product.price.info} />
          )}
          <CartItemProductPriceCaption />
        </div>
        <div className={column}>
          { isEditable ? (
            <CartUnitQuantityPicker
              productId={product.id}
              value={cartItem.quantity}
              unit={product.unit}
              onChange={handleUpdate}
              classNames={{
                withDecimals: quantityPicker,
                withoutDecimals: quantityPicker,
              }}
            />
          ) : (
            <QuantityInput
              disabled
              className={quantityPickerDisabled}
              value={cartItem.quantity}
              unit={hasUnitWithDecimals ? product.unit : null}
              maxDecimals={hasUnitWithDecimals ? 2 : 0}
            />
          )}
          { isEditable && (
            <CartItemProductLayoutWideRemoveItem />
          )}
        </div>
        <div className={column}>
          <CartItemProductPrice
            currency={currency}
            defaultPrice={product.price.special || product.price.default}
            classNames={{
              price,
              priceStriked: price,
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
