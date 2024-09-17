import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  Grid, Link, TextLink, ProductProperties, SurroundPortals, ConditionalWrapper, I18n,
} from '@shopgate/engage/components';
import {
  CART_ITEM_IMAGE,
  CART_ITEM_LINK,
  CART_ITEM_PROPERTIES,
  CART_ITEM_QUANTITY_PICKER,
} from '@shopgate/engage/cart';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { bin2hex } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { ProductImage, PriceInfo, ITEM_PATH } from '@shopgate/engage/product';
import {
  CartItemProductChangeLocation,
  CartChangeFulfillmentMethod,
} from '@shopgate/engage/locations';
import { getLineItemActiveStatus } from '@shopgate/engage/orders';
import { CartItemQuantityPicker } from './CartItemQuantityPicker';
import { CartItemProductTitle } from './CartItemProductTitle';
import CartItemProductOrderDetails from './CartItemProductOrderDetails';
import CartItemProductPriceList from './CartItemProductPriceList';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import styles from './CartItemProductLayout.style';

/**
 * The Cart Product Layout component.
 * @returns {JSX}
 */
export function CartItemProductLayout() {
  // Added with PWA 6 - CCP-2372
  const {
    show,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');
  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = typeof show === 'boolean' ? show : showTaxDisclaimer;

  const { registerFulfillmentAction, isOrderDetails, isCheckoutConfirmation } = useCartItem();
  const context = useCartItemProduct();
  const {
    cartItem,
    product,
    currency,
    editMode,
    handleUpdate,
    toggleEditMode,
    isEditable,
  } = context;

  const portalProps = useMemo(() => ({
    ...context,
    isOrderDetails,
    isCheckoutConfirmation,
    quantity: cartItem.quantity,
  }), [cartItem.quantity, context, isCheckoutConfirmation, isOrderDetails]);

  const isActive = !isOrderDetails
    ? true
    : getLineItemActiveStatus(cartItem?.status, cartItem?.subStatus);

  const showLineItemPromotions = useMemo(() => {
    if (isOrderDetails || isCheckoutConfirmation) {
      return false;
    }

    return (cartItem?.appliedPromotions || []).length > 0;
  }, [cartItem, isCheckoutConfirmation, isOrderDetails]);

  return (
    <React.Fragment>
      <Grid className={classNames(styles.item, {
        [styles.itemInactive]: !isActive,
      })}
      >
        <Grid.Item className={styles.content} grow={1}>
          <ConditionalWrapper
            condition={isEditable}
            wrapper={children =>
              <TextLink href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
                {children}
              </TextLink>

            }
          >
            <SurroundPortals
              portalName={CART_ITEM_LINK}
              portalProps={portalProps}
            >
              <CartItemProductTitle value={product.name} />
            </SurroundPortals>
          </ConditionalWrapper>
          <Grid className={styles.info}>
            <Grid.Item grow={1} className={styles.properties}>
              <SurroundPortals
                portalName={CART_ITEM_PROPERTIES}
                portalProps={portalProps}
              >
                <ProductProperties properties={product.properties} lineClamp={2} />
              </SurroundPortals>
              { isOrderDetails && (
                <CartItemProductOrderDetails />
              )}
            </Grid.Item>
            <Grid.Item grow={1} className={styles.price}>
              { isOrderDetails && (
                <I18n.Text string="cart.subtotal" className={styles.orderDetailsSubtotalLabel} />
              )}
              { !showLineItemPromotions && (
                <>
                  <CartItemProductPriceList isSubtotal />
                  <PriceInfo product={product} currency={currency} className={styles.priceInfo} />
                </>
              )}
            </Grid.Item>
            {showDisclaimer && (
              <Grid.Item
                className={styles.disclaimerSpacer}
                grow={0}
                shrink={0}
              />
            )}
          </Grid>
          { showLineItemPromotions && (
            <Grid className={classNames(styles.info, styles.promotionLine)}>
              <Grid.Item />
              <Grid.Item className={styles.promotionLineItem}>
                <CartItemProductPriceList isSubtotal showLabels />
                <PriceInfo product={product} currency={currency} className={styles.priceInfo} />
              </Grid.Item>
            </Grid>
          )}
        </Grid.Item>
        {/** DOM reversed for a11y navigation */}
        <Grid.Item className={styles.leftColumn}>
          <div className={styles.image} aria-hidden>
            <ConditionalWrapper
              condition={isEditable}
              wrapper={children =>
                <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
                  {children}
                </Link>
              }
            >
              <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={portalProps}>
                <ProductImage src={product.featuredImageBaseUrl || product.featuredImageUrl} />
              </SurroundPortals>
            </ConditionalWrapper>
          </div>
          { !isOrderDetails && (
            <SurroundPortals
              portalName={CART_ITEM_QUANTITY_PICKER}
              portalProps={portalProps}
            >
              <CartItemQuantityPicker
                unit={product.unit}
                hasCatchWeight={product.hasCatchWeight}
                quantity={cartItem.quantity}
                editMode={editMode}
                onChange={handleUpdate}
                onToggleEditMode={toggleEditMode}
                disabled={!isEditable}
              />
            </SurroundPortals>
          )}
        </Grid.Item>
      </Grid>
      <CartItemProductChangeLocation
        cartItem={cartItem}
        registerAction={registerFulfillmentAction}
      />
      <CartChangeFulfillmentMethod
        cartItem={cartItem}
        registerAction={registerFulfillmentAction}
      />
    </React.Fragment>
  );
}
