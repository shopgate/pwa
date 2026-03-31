import React, { useMemo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  Grid, Link, ProductProperties, SurroundPortals, ConditionalWrapper, I18n,
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

const { colors } = themeConfig;
const leftColumnWidth = 72;

const useStyles = makeStyles()((theme, _params, classes) => ({
  item: {
    padding: theme.spacing(2),
    // Row is DOM reversed for a11y navigation.
    flexDirection: 'row-reverse',
  },
  leftColumn: {
    width: leftColumnWidth,
  },
  image: {
    background: colors.placeholder,
    marginBottom: theme.spacing(1.25),
    height: leftColumnWidth,
    width: leftColumnWidth,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
  },
  info: {
    fontSize: '0.875rem',
    marginTop: theme.spacing(1.75),
    marginBottom: theme.spacing(1) * 0.25,
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  promotionLine: {
    marginTop: 0,
  },
  promotionLineItem: {
    width: '100%',
  },
  priceInfo: {
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  disclaimerSpacer: {
    width: 10,
  },
  price: {
    display: 'flex',
    marginLeft: '1em',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  properties: {
    wordBreak: 'break-word',
    alignSelf: 'flex-start',
    fontSize: '0.875rem',
    color: 'var(--color-text-medium-emphasis)',
    lineHeight: 1.3,
    '&:not(:empty)': {
      [`+ .${classes.price}`]: {
        textAlign: 'right',
        maxWidth: '40%',
      },
    },
  },
  itemInactive: {
    ' *': {
      color: `${theme.palette.text.secondary} !important`,
    },
    [` .${classes.image}`]: {
      opacity: 0.7,
    },
  },
  orderDetailsSubtotalLabel: {
    color: theme.palette.text.secondary,
  },
}));

/**
 * The Cart Product Layout component.
 * @returns {JSX.Element}
 */
export function CartItemProductLayout() {
  const { classes, cx } = useStyles();
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
    handleRemove,
    toggleEditMode,
    isEditable,
    isLinkable,
    allowQuantityChange,
  } = context;

  const portalProps = useMemo(() => ({
    context: {
      type: context.type,
      cartItemId: context.cartItemId,
      product: context.product,
    },
    ...context,
    isOrderDetails,
    isCheckoutConfirmation,
    quantity: cartItem.quantity,
    handleDelete: handleRemove,
  }), [cartItem.quantity, context, handleRemove, isCheckoutConfirmation, isOrderDetails]);

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
    <>
      <Grid className={cx(classes.item, {
        [classes.itemInactive]: !isActive,
      })}
      >
        <Grid.Item className={classes.content} grow={1}>
          <SurroundPortals
            portalName={CART_ITEM_LINK}
            portalProps={portalProps}
          >
            <CartItemProductTitle value={product.name} productId={product.id} />
          </SurroundPortals>
          <Grid className={classes.info}>
            <Grid.Item grow={1} className={classes.properties}>
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
            <Grid.Item grow={1} className={classes.price}>
              { isOrderDetails && (
                <I18n.Text string="cart.subtotal" className={classes.orderDetailsSubtotalLabel} />
              )}
              { !showLineItemPromotions && (
                <>
                  <CartItemProductPriceList isSubtotal />
                  <PriceInfo product={product} currency={currency} className={classes.priceInfo} />
                </>
              )}
            </Grid.Item>
            {showDisclaimer && (
              <Grid.Item
                className={classes.disclaimerSpacer}
                grow={0}
                shrink={0}
              />
            )}
          </Grid>
          { showLineItemPromotions && (
            <Grid className={cx(classes.info, classes.promotionLine)}>
              <Grid.Item />
              <Grid.Item className={classes.promotionLineItem}>
                <CartItemProductPriceList isSubtotal showLabels />
                <PriceInfo product={product} currency={currency} className={classes.priceInfo} />
              </Grid.Item>
            </Grid>
          )}
        </Grid.Item>
        {/** DOM reversed for a11y navigation */}
        <Grid.Item className={classes.leftColumn}>
          <div className={classes.image} aria-hidden>
            <ConditionalWrapper
              condition={isEditable && isLinkable}
              wrapper={children =>
                <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(product.id)}`}>
                  {children}
                </Link>}
            >
              <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={portalProps}>
                <ProductImage src={product.featuredImageBaseUrl || product.featuredImageUrl} />
              </SurroundPortals>
            </ConditionalWrapper>
          </div>
          { !isOrderDetails && allowQuantityChange && (
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
    </>
  );
}
