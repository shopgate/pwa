import React, { Fragment } from 'react';
import PT from 'prop-types';
import {
  TextLink,
  SurroundPortals,
  ProductProperties,
  Ellipsis,
  QuantityInput,
} from '@shopgate/engage/components';
import {
  ProductImage,
  CartUnitQuantityPicker,
  ITEM_PATH,
  PRODUCT_UNIT_EACH,
} from '@shopgate/engage/product';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import { bin2hex } from '@shopgate/engage/core';
import {
  CartItemProductChangeLocation,
  CartChangeFulfillmentMethod,
} from '@shopgate/engage/locations';
import { CartItemProductPrice } from './CartItemProductPrice';
import { CartItemProductContextMenu } from './CartItemProductContextMenu';
import { CartItemProductLayoutWideRemoveItem } from './CartItemProductLayoutWideRemoveItem';
import { CartItemProductLayoutWideFulfillmentLabel } from './CartItemProductLayoutWideFulfillmentLabel';
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
} from './CartItemProductLayoutWide.style';

type Props = {
  currency: string,
  product: Product,
  quantity: number,
  handleDelete?: () => void,
  handleUpdate?: (quantity: number) => void,
  toggleEditMode?: () => void,
}

type ContextProps = {
  registerAction: () => void,
  cartItem?: Item,
  cartItemId?: string,
  type?: string,
  editable?: boolean
}

/**
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const CartItemProductLayoutWide = (props: Props, context: ContextProps) => {
  const {
    product, currency, handleDelete, toggleEditMode, quantity, handleUpdate,
  } = props;
  const { cartItem, registerAction, editable } = context;
  const fulfillmentMethod = cartItem?.fulfillment?.method || null;

  return (
    <Fragment>
      <div className={container}>
        <div className={imageColumn}>
          <ProductImage src={product.featuredImageUrl} />
        </div>
        <div className={detailsColumn}>
          <TextLink href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
            <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
              <Ellipsis>
                <div
                  className={productName}
                  data-test-id={product.name}
                  dangerouslySetInnerHTML={{ __html: product.name }}
                />
              </Ellipsis>
            </SurroundPortals>
          </TextLink>
          <ProductProperties
            className={productProperties}
            properties={product.properties}
            lineClamp={2}
          />
          <CartItemProductLayoutWideFulfillmentLabel fulfillmentMethod={fulfillmentMethod} />
        </div>
        <div className={column}>
          <CartItemProductPrice
            currency={currency}
            defaultPrice={product.price.unit}
            classNames={{
              price,
              priceStriked: price,
            }}
          />
        </div>
        <div className={column}>
          { editable ? (
            <CartUnitQuantityPicker
              productId={product.id}
              value={quantity}
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
              value={quantity}
              unit={product.unit && product.unit !== PRODUCT_UNIT_EACH ? product.unit : null}
            />
          )}

          { editable && (
            <CartItemProductLayoutWideRemoveItem handleDelete={handleDelete} />
          )}
        </div>
        <div className={column}>
          <CartItemProductPrice
            currency={currency}
            defaultPrice={product.price.default}
            specialPrice={product.price.special}
            classNames={{
              price,
              priceStriked: price,
            }}
          />
        </div>
        { editable && (
          <ul>
            <CartItemProductContextMenu
              handleRemove={handleDelete}
              toggleEditMode={toggleEditMode}
              showEdit={false}
              showRemove={false}
            />
          </ul>
        )}
      </div>
      <CartItemProductChangeLocation cartItem={cartItem} registerAction={registerAction} />
      <CartChangeFulfillmentMethod cartItem={cartItem} registerAction={registerAction} />
    </Fragment>
  );
};

CartItemProductLayoutWide.defaultProps = {
  handleDelete: () => { },
  handleUpdate: () => { },
  toggleEditMode: () => { },
};

CartItemProductLayoutWide.contextTypes = {
  registerAction: PT.func,
  cartItem: PT.shape(),
  cartItemId: PT.string,
  type: PT.string,
  editable: PT.bool,
};

export { CartItemProductLayoutWide };
