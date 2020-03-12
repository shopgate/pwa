// @flow
import React, { useCallback, useState } from 'react';
import { SurroundPortals, RadioGroup } from '@shopgate/engage/components';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { StockInfo } from '../StockInfo';
import {
  DIRECT_SHIP,
  IN_STORE_PICKUP,
  PRODUCT_FULFILLMENT_SELECTOR,
} from '../../constants';
import FulfillmentSelectorItem from './FulfillmentSelectorItem';
import FulfillmentSelectorItemDirectShip from './FulfillmentSelectorItemDirectShip';
import { FulfillmentSelectorItemReserve } from './FulfillmentSelectorItemReserve';
import FulfillmentSelectorAddToCart from './FulfillmentSelectorAddToCart';
import { FulfillmentSelectorTitle } from './FulfillmentSelectorTitle';
import { ChangeLocationButton } from '../ChangeLocationButton';
import connect from './FulfillmentSelector.connector';
import * as styles from './FulfillmentSelector.style';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

type Props = OwnProps & StateProps & DispatchProps;

const directShip = 'locations.fulfillment.direct_ship';
const pickUp = 'locations.fulfillment.pick_up_in_store';

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
    shopFulfillmentMethods,
    location,
    conditioner,
    disabled,
    storeFulfillmentMethod,
    userFulfillmentMethod,
  } = props;

  const isInStoreAndActive = userFulfillmentMethod === IN_STORE_PICKUP && !disabled;

  const [selection, setSelection] = useState(isInStoreAndActive ? pickUp : directShip);
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

      const method = (elementName === pickUp) ? IN_STORE_PICKUP : DIRECT_SHIP;

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

  if (!shopFulfillmentMethods || shopFulfillmentMethods.length === 0) {
    return null;
  }

  /**
   * Click handler for pick up in store.
   */
  function handleChangePickup() {
    handleChange(IN_STORE_PICKUP, true);
  }

  return (
    <SurroundPortals portalName={PRODUCT_FULFILLMENT_SELECTOR} portalProps={{ productCode }}>
      <div className={styles.container} data-test-id="product-fulfillment-selector">
        <FulfillmentSelectorTitle />
        <RadioGroup
          name="product.fulfillment_selector"
          value={selection}
          className={disabled ? styles.radioGroupDisabled : styles.radioGroup}
          onChange={handleChange}
          isControlled
          direction="column"
        >
          <FulfillmentSelectorItem name={directShip}>
            <FulfillmentSelectorItemDirectShip
              selected={selection === directShip}
              productId={productCode}
            />
          </FulfillmentSelectorItem>
          <FulfillmentSelectorItem name={pickUp}>
            {!disabled && (
              <FulfillmentSelectorItemReserve
                location={selectedLocation || location}
                selected={selection === pickUp}
              >
                {location && (
                  <div className={styles.pickUpGroupContainer}>
                    <StockInfo location={selectedLocation || location} />
                    {(selection === pickUp) && (
                      <ChangeLocationButton onClick={handleChangePickup} />
                    )}
                  </div>
                )}
              </FulfillmentSelectorItemReserve>
            )}
          </FulfillmentSelectorItem>
        </RadioGroup>
      </div>
      {!disabled && (
        <FulfillmentSelectorAddToCart
          conditioner={conditioner}
          location={selectedLocation || location}
        />
      )}
    </SurroundPortals>
  );
};

FulfillmentSelector.defaultProps = {
  disabled: true,
  fulfillmentMethods: null,
  location: null,
  storeFulfillmentMethod() { },
};

export default connect(FulfillmentSelector);
