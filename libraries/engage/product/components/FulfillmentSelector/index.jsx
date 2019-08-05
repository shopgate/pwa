import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import I18n from '@shopgate/pwa-common/components/I18n';
import RadioGroup from '@shopgate/pwa-ui-shared/Form/RadioGroup';
import RadioItem from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item';
import { isBeta } from '../../../core/config/isBeta';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
} from '../../constants';
import { PRODUCT_FULFILLMENT_SELECTOR } from '../../constants/Portals';
import Availability from '../Availability';
import { StoreSelector } from '../StoreSelector';
import LocationStockInfo from '../LocationStockInfo';
import connect from './connector';
import * as styles from './style';

// TODO: Integrate a conditioner that ensures selection of characteristics and required options
/**
 * Fulfillment/Store selector box
 * @return {JSX}
 */
export const FulfillmentSelector = ({ productCode, fulfillmentMethods, location }) => {
  if (!isBeta()) { // TODO: Change to feature flag!
    return null;
  }

  // Don't render, when no pick up in store is available for the given product.
  if (!fulfillmentMethods
    || fulfillmentMethods.indexOf(PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP) === -1) {
    return null;
  }

  const directShip = 'product.fulfillment_selector.direct_ship';
  const pickUp = 'product.fulfillment_selector.pick_up_in_store';

  // Pre-select direct ship on entering the PDP
  const [selection, setSelection] = useState(directShip);

  // Keep the selected location in the state
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Keeps track of the selector sheet being opened or not, to "debounce" open events.
  const [isSelectorOpened, setIsSelectorOpened] = useState(false);

  // When the product code changes, the selection will reset
  const [currentProductCode, setCurrentProductCode] = useState(productCode);
  if (productCode !== currentProductCode) {
    setCurrentProductCode(productCode);
    setSelection(directShip);

    // Close selector sheet as well when it is currently opened
    if (isSelectorOpened) {
      StoreSelector.close();
      setIsSelectorOpened(false);
    }
  }

  // Whenever the pick-up selection is made, open the store selector sheet and use the new location.
  const handleChange = useCallback((elementName) => {
    if (elementName === pickUp) {
      // Debounce sheet open action
      if (isSelectorOpened) {
        return;
      }

      // Open the sheet and provide a callback for when it is closed.
      setIsSelectorOpened(true);

      // TODO: Change this to open the store selector only if it wasn't yet selected for the product
      // TODO: Opening the selector to change selection should be done with a "Choose Location" link
      StoreSelector.open((newLocation) => {
        setIsSelectorOpened(false);
        if (!newLocation) {
          // Reset selections to what they were before the StoreSelector was opened.
          setSelectedLocation(selectedLocation);

          // Reset the UI to
          if (!selectedLocation) {
            setSelection(selection);
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
    setSelection(elementName);
  });

  return (
    <SurroundPortals
      portalName={PRODUCT_FULFILLMENT_SELECTOR}
      portalProps={{ productCode }}
    >
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
          <RadioItem
            name={directShip}
            className={styles.radioItem}
            label={
              <div className={styles.radioGroupItemLabel}>
                <I18n.Text string={directShip} />
                <Availability
                  productId={productCode}
                  fulfillmentSelection={PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP}
                />
              </div>
            }
          />
          <RadioItem
            name={pickUp}
            className={styles.radioItem}
            label={
              <div className={styles.radioGroupItemLabel}>
                <I18n.Text string={pickUp} />
                {location &&
                  <LocationStockInfo location={selectedLocation || location} />
                }
              </div>
            }
          />
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
