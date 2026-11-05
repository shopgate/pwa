import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { IconButton } from '@shopgate/engage/components/v2';
import {
  Grid, ContextMenu, SurroundPortals, TextLink, TrashOutlineIcon,
} from '@shopgate/engage/components';
import {
  CART_ITEM_CONTEXT_MENU,
  CART_ITEM_NAME,
} from '@shopgate/engage/cart';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
  DIRECT_SHIP,
} from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core/helpers';
import { ITEM_PATH, ProductName } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import { ConditionalWrapper } from '../../../components';

const useStyles = makeStyles()(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'contents',
    },
  },
  name: {
    [theme.breakpoints.up('md')]: {
      gridArea: 'name',
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    wordBreak: ['keep-all', 'break-word'],
    hyphens: 'auto',
  },
  menuContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    [theme.breakpoints.up('md')]: {
      gridArea: 'menu',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '& .engage__cart__item__remove': {
      color: theme.palette.text.secondary,
    },
  },
  menuToggleContainer: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      margin: 0,
    },
  },
  menuToggleButton: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    fontSize: theme.components.icon.medium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
}));

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {string} props.value The product name
 * @param {string} props.productId The product id
 * @returns {JSX.Element}
 */
export function CartItemProductTitle({ value, productId }) {
  const { classes } = useStyles();
  const { invokeFulfillmentAction, merchantFulfillmentMethodsCount } = useCartItem();

  const context = useCartItemProduct();
  const {
    handleRemove, toggleEditMode, cartItem, isEditable, isLinkable,
  } = context;

  const handleChangeLocationClick = useCallback(() => {
    if (!cartItem || !cartItem.fulfillment || !cartItem.fulfillment.method) {
      return;
    }

    const { fulfillment: { method } } = cartItem;

    invokeFulfillmentAction('changeLocation', method);
  }, [cartItem, invokeFulfillmentAction]);

  const handleChangeFulfillmentClick = useCallback(() => {
    invokeFulfillmentAction('changeFulfillment');
  }, [invokeFulfillmentAction]);

  const hasFulfillmentActions = merchantFulfillmentMethodsCount > 1
    || (!!cartItem?.fulfillment && cartItem.fulfillment.method !== DIRECT_SHIP);

  const contextMenuClasses = useMemo(() => ({
    button: classes.menuToggleButton,
    container: classes.menuToggleContainer,
  }), [classes.menuToggleButton, classes.menuToggleContainer]);

  return (
    <Grid className={classes.root}>
      <Grid.Item grow={1} className={classes.name}>
        <ConditionalWrapper
          condition={isEditable && isLinkable}
          wrapper={children =>
            <TextLink href={`${ITEM_PATH}/${bin2hex(productId)}`}>
              {children}
            </TextLink>}
        >
          <ProductName
            name={value}
            className={classes.title}
            portalName={CART_ITEM_NAME}
            portalProps={context}
            testId={value}
            ellipsis={false}
          />
        </ConditionalWrapper>
      </Grid.Item>
      { isEditable && (
        <Grid.Item className={classes.menuContainer} shrink={0}>
          <SurroundPortals
            portalName={CART_ITEM_CONTEXT_MENU}
            portalProps={{
              context,
              handleRemove,
              toggleEditMode,
            }}
          >
            <IconButton
              aria-label={i18n.text('cart.remove')}
              onClick={handleRemove}
              className="engage__cart__item__remove"
              data-test-id="cartItemRemove"
            >
              <TrashOutlineIcon />
            </IconButton>
            {hasFulfillmentActions && (
            <ContextMenu classes={contextMenuClasses}>
              <CartContextMenuItemChangeLocation
                cartItem={context.cartItem}
                onClick={handleChangeLocationClick}
              />
              <CartContextMenuItemChangeFulfillment
                cartItem={context.cartItem}
                onClick={handleChangeFulfillmentClick}
              />
            </ContextMenu>
            )}
          </SurroundPortals>
        </Grid.Item>
      )}
    </Grid>
  );
}

CartItemProductTitle.propTypes = {
  productId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
