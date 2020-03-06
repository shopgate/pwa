// @flow
import { hot } from 'react-hot-loader/root';
import React, { useCallback, useState } from 'react';
import { I18n, SurroundPortals, RadioGroup } from '@shopgate/engage/components';
import { Availability } from '@shopgate/engage/product';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { StockInfo } from '../StockInfo';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
  PRODUCT_FULFILLMENT_SELECTOR,
} from '../../constants';
import FulfillmentSelectorItem from './FulfillmentSelectorItem';
import FulfillmentSelectorButtonChangeLocation from './FulfillmentSelectorButtonChangeLocation';
import FulfillmentSelectorAddToCart from './FulfillmentSelectorAddToCart';
import connect from './FulfillmentSelector.connector';
import * as styles from './FulfillmentSelector.style';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

type Props = OwnProps & StateProps & DispatchProps;

/**
 * Renders a fulfillment selector box for fulfillment methods direct ship and pick up in store,
 * when fulfillment methods are set up for the product and pick up in store is one of them.
 * @param {Object} props The component props.
 * @param {string} props.productCode Code to the product or a variant.
 * @param {string[]} props.fulfillmentMethods All fulfillment methods provided for the product.
 * @param {Object} props.location Last location that was selected for the previous product/variant.
 * @returns {JSX}
 */
export const FulfillmentSelector = (props: Props) => {
  const {
    productId: productCode,
    fulfillmentMethods,
    location,
    conditioner,
    disabled,
    storeFulfillmentMethod,
  } = props;
  const directShip = 'product.fulfillment_selector.direct_ship';
  const pickUp = 'product.fulfillment_selector.pick_up_in_store';

  const [selection, setSelection] = useState(location.productInventory ? pickUp : directShip);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Update selected location for sheet close
  const handleClose = useCallback((newLocationData) => {
    setIsOpen(false);
    if (!newLocationData) {
      // Reset the UI back to directShip if there was no location selected already
      if (selectedLocation === null) {
        setSelection(directShip);
      }
    } else if (newLocationData.productCode === productCode) {
      // Update the selected location only when the selection was done for the same product.
      setSelectedLocation(newLocationData.location);
    }
  }, [selectedLocation, productCode]);

  /**
   * Whenever the pick-up selection is made, open the
   * store selector sheet and use the new location.
   */
  const handleChange = useCallback((elementName, changeOnly = false) => {
    // Run only external conditions
    conditioner.without('fulfillment-inventory').check().then((passed) => {
      if (!passed) {
        return;
      }

      let method = PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP;

      if (elementName === pickUp) {
        method = PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP;
      }

      setSelection(elementName);
      storeFulfillmentMethod(method);

      if (isOpen) {
        return;
      }

      if (elementName === directShip) {
        setSelectedLocation(null);
        return;
      }

      if (elementName === pickUp && location.code) {
        return;
      }

      setIsOpen(true);
      FulfillmentSheet.open({
        callback: handleClose,
        changeOnly,
      });
    });
  }, [conditioner, storeFulfillmentMethod, isOpen, location, handleClose]);

  if (!fulfillmentMethods) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_FULFILLMENT_SELECTOR} portalProps={{ productCode }}>
      <div
        className={styles.container}
        data-test-id="product-fulfillment-selector"
      >
        <div role="heading" aria-hidden className={styles.title}>
          <I18n.Text string="product.fulfillment_selector.heading" />
        </div>
        <RadioGroup
          name="product.fulfillment_selector"
          value={selection}
          className={disabled ? styles.radioGroupDisabled : styles.radioGroup}
          onChange={handleChange}
          isControlled
          direction="column"
        >
          <FulfillmentSelectorItem name={directShip}>
            <Availability
              productId={productCode}
              fulfillmentSelection={PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP}
            />
          </FulfillmentSelectorItem>
          <FulfillmentSelectorItem name={pickUp}>
            {location && (
              <div className={styles.pickUpGroupContainer}>
                <StockInfo location={selectedLocation || location} />
                {(selection === pickUp) && (
                  <FulfillmentSelectorButtonChangeLocation
                    onClick={() => handleChange(PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP, true)}
                  />
                )}
              </div>
            )}
          </FulfillmentSelectorItem>
        </RadioGroup>
      </div>
      <FulfillmentSelectorAddToCart
        conditioner={conditioner}
        location={selectedLocation || location}
      />
    </SurroundPortals>
  );
};

FulfillmentSelector.defaultProps = {
  disabled: true,
  fulfillmentMethods: null,
  location: null,
  storeFulfillmentMethod() { },
};

export default hot(connect(FulfillmentSelector));
