import React, { useCallback, useMemo } from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  I18n, ContextMenu,
} from '@shopgate/engage/components';
import {
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
} from '../../constants';
import { useFulfillmentState } from '../../locations.hooks';

const { variables } = themeConfig;
const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

const useStyles = makeStyles()({
  menuToggleContainer: {
    margin: variables.gap.small,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      marginLeft: 0,
    },
  },
  menuToggleButton: {
    height: menuToggleSize,
    width: menuToggleSize,
    fontSize: menuToggleFontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

/**
 * The CartContextMenuChangeFulfillmentContent component renders a context menu which enables
 * switching the active fulfillment method for a cart item.
 * @returns {JSX}
 */
const CartContextMenuChangeFulfillmentContent = () => {
  const { classes } = useStyles();
  const labelMapping = {
    [DIRECT_SHIP]: 'cart.change_fulfillment.direct_ship',
    [ROPIS]: 'cart.change_fulfillment.ropis',
    [BOPIS]: 'cart.change_fulfillment.bopis',
  };

  const {
    fulfillmentMethods,
    enabledFulfillmentMethods,
    meta: { cartItem },
    changeFulfillment,
  } = useFulfillmentState();

  const activeFulfillmentMethod = useMemo(
    () => cartItem.fulfillment?.method || DIRECT_SHIP,
    [cartItem.fulfillment]
  );

  const handleChangeFulfillment = useCallback((method) => {
    changeFulfillment(method, cartItem);
  }, [cartItem, changeFulfillment]);

  const selectableFulfillmentMethods = useMemo(() => {
    if (!enabledFulfillmentMethods || !fulfillmentMethods) {
      return [];
    }

    return fulfillmentMethods.filter(
      method =>
        enabledFulfillmentMethods.includes(method) &&
        method !== activeFulfillmentMethod
    );
  }, [activeFulfillmentMethod, enabledFulfillmentMethods, fulfillmentMethods]);

  const disabled = selectableFulfillmentMethods.length === 0;
  const contextMenuClasses = useMemo(() => ({
    button: classes.menuToggleButton,
    container: classes.menuToggleContainer,
  }), [classes.menuToggleButton, classes.menuToggleContainer]);

  return (
    <ContextMenu classes={contextMenuClasses} disabled={disabled}>
      { selectableFulfillmentMethods.map(method => (
        <ContextMenu.Item key={method} onClick={() => handleChangeFulfillment(method)}>
          <I18n.Text string={labelMapping[method]} />
        </ContextMenu.Item>
      ))}
    </ContextMenu>
  );
};

export default CartContextMenuChangeFulfillmentContent;
