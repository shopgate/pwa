import React, { useState, useCallback } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { Availability } from '@shopgate/engage/product';
import { RadioGroup } from '../../../components';
import { useFulfillmentState } from '../../locations.hooks';
import {
  IN_STORE_PICKUP_BOPIS_LABEL,
  IN_STORE_PICKUP_ROPIS_LABEL,
  DIRECT_SHIP_LABEL,
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
} from '../../constants';
import { FulfillmentPathItem } from './FulfillmentPathItem';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    padding: `0 ${variables.gap.big}px`,
  },
  radioGroup: {
    // Removes the vertical padding applied by default around radio groups
    paddingTop: 0,
    paddingBottom: 0,
    transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
});

const labelMapping = {
  [DIRECT_SHIP]: DIRECT_SHIP_LABEL,
  [ROPIS]: IN_STORE_PICKUP_ROPIS_LABEL,
  [BOPIS]: IN_STORE_PICKUP_BOPIS_LABEL,
};

/**
 * Renders the fulfillment path selector stage.
 * @returns {JSX}
 */
export function FulfillmentPath() {
  const { classes } = useStyles();
  const {
    product,
    enabledFulfillmentMethods,
    meta: { cartItem = undefined } = {},
    changeFulfillment,
  } = useFulfillmentState();
  const {
    fulfillment = {},
    product: { fulfillmentMethods: cartItemFulfillmentMethods = [] } = {},
  } = cartItem || {};

  const { method: activeCartItemFulfillmentMethod = DIRECT_SHIP } = fulfillment || {};
  const [selection, setSelection] = useState(labelMapping[activeCartItemFulfillmentMethod]);

  const handleChange = useCallback((elementName) => {
    const method = Object.keys(labelMapping).find(key => labelMapping[key] === elementName);
    setSelection(method);
    changeFulfillment(method, cartItem);
  }, [cartItem, changeFulfillment]);

  return (
    <div className={classes.container}>
      <RadioGroup
        name="cartItem.fulfillment_selector"
        value={selection}
        onChange={handleChange}
        className={classes.radioGroup}
        isControlled
        direction="column"
      >
        {enabledFulfillmentMethods.includes(DIRECT_SHIP) && (
          <FulfillmentPathItem
            name={DIRECT_SHIP_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(DIRECT_SHIP) }}
          >
            <Availability productId={product.id} fulfillmentSelection={DIRECT_SHIP} />
          </FulfillmentPathItem>
        )}
        {enabledFulfillmentMethods.includes(BOPIS) && (
          <FulfillmentPathItem
            name={IN_STORE_PICKUP_BOPIS_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(BOPIS) }}
          />
        )}
        {enabledFulfillmentMethods.includes(ROPIS) && (
          <FulfillmentPathItem
            name={IN_STORE_PICKUP_ROPIS_LABEL}
            attributes={{ disabled: !cartItemFulfillmentMethods.includes(ROPIS) }}
          />
        )}

      </RadioGroup>
    </div>
  );
}
