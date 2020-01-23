import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals, RadioGroup } from '@shopgate/engage/components';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
  PRODUCT_FULFILLMENT_SELECTOR,
  Availability,
  StoreSelector,
  LocationStockInfo,
} from '@shopgate/engage/product';
import FulfillmentSelectorItem from './FulfillmentSelectorItem';
import connect from './connector';
import * as styles from './style';

// TODO: Integrate a conditioner that ensures selection of characteristics and required options
/**
 * Renders a fulfillment selector box for fulfillment methods direct ship and pick up in store,
 * when fulfillment methods are set up for the product and pick up in store is one of them.
 * @param {string} props.productCode Code to the product or a variant.
 * @param {string[]} props.fulfillmentMethods All fulfillment methods provided for the product.
 * @param {Object} props.location Last location that was selected for the previous product/variant.
 * @returns {JSX}
 */
export const FulfillmentSelector = ({ productCode, fulfillmentMethods, location }) => {
  const directShip = 'product.fulfillment_selector.direct_ship';
  const pickUp = 'product.fulfillment_selector.pick_up_in_store';

  // Pre-select direct ship on entering the PDP
  const [selection, setSelection] = useState(directShip);
  // Keep the selected location in the state
  const [selectedLocation, setSelectedLocation] = useState(null);
  // Keeps track of the selector sheet being opened or not, to "debounce" open events.
  const [isSelectorOpened, setIsSelectorOpened] = useState(false);

  // When the product code changes, the selection will reset to direct ship
  useEffect(() => {
    setSelection(directShip);

    // Force the store selector to open when "pick up" is selected on every variant change
    setSelectedLocation(null);

    // Close selector sheet as well when it is currently opened
    if (isSelectorOpened) {
      StoreSelector.close();
      setIsSelectorOpened(false);
    }
  }, [isSelectorOpened, productCode]);

  // Whenever the pick-up selection is made, open the store selector sheet and use the new location.
  const handleChange = useCallback((elementName) => {
    // Immediately update radio item selection for more responsiveness
    setSelection(elementName);

    // Handle selection of a location and aborting the Store Selector sheet
    if (elementName === pickUp) {
      // Debounce sheet open action
      if (isSelectorOpened) {
        return;
      }

      // Open the store selector sheet and provide a callback for when it is closed.
      setIsSelectorOpened(true);

      // TODO: Change this to open the store selector only if it wasn't yet selected for the product
      // TODO: Opening the selector to change selection should be done with a "Choose Location" link
      StoreSelector.open((newLocation) => {
        setIsSelectorOpened(false);
        if (!newLocation) {
          // Reset the UI back to directShip if there was no location selected already
          if (selectedLocation === null) {
            setSelection(directShip);
          }
        } else if (newLocation.productCode === productCode) {
          // Update the selected location only when the selection was done for the same product.
          setSelectedLocation(newLocation);
        }
      });
    } else {
      // Invalidate the location selection to stay in sync with the selected ui element
      setSelectedLocation(null);
    }
  }, [isSelectorOpened, selectedLocation, productCode]);

  // Don't render, when no pick up in store is available for the given product.
  if (!fulfillmentMethods
    || fulfillmentMethods.indexOf(PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP) === -1) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_FULFILLMENT_SELECTOR} portalProps={{ productCode }}>
      <div className={styles.container} data-test-id="product-fulfillment-selector">
        <div role="heading" aria-hidden className={styles.title}>
          <I18n.Text string="product.fulfillment_selector.heading" />
        </div>
        <RadioGroup
          name="product.fulfillment_selector"
          value={selection}
          className={styles.radioGroup}
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
            {location && <LocationStockInfo location={selectedLocation || location} />}
          </FulfillmentSelectorItem>
        </RadioGroup>
      </div>
    </SurroundPortals>
  );
};

FulfillmentSelector.propTypes = {
  productCode: PropTypes.string.isRequired,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    name: PropTypes.string,
    productCode: PropTypes.string,
    visibleInventory: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    inventoryBlind: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
};

FulfillmentSelector.defaultProps = {
  fulfillmentMethods: null,
  location: null,
};

export default connect(FulfillmentSelector);
