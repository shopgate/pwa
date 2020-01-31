import { hot } from 'react-hot-loader/root';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals, RadioGroup } from '@shopgate/engage/components';
import { Availability } from '@shopgate/engage/product';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { StockInfo } from '../StockInfo';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_SELECTOR,
} from '../../constants';
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
export const FulfillmentSelector = ({ productId: productCode, fulfillmentMethods, location }) => {
  const directShip = 'product.fulfillment_selector.direct_ship';
  const pickUp = 'product.fulfillment_selector.pick_up_in_store';

  const [selection, setSelection] = useState(location.code !== null ? pickUp : directShip);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSelectorOpened, setIsSelectorOpened] = useState(false);

  const handleSelectorClose = useCallback((newLocation) => {
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
  }, [productCode, selectedLocation]);

  /**
   * Whenever the pick-up selection is made, open the
   * store selector sheet and use the new location.
   */
  const handleChange = useCallback((elementName) => {
    setSelection(elementName);

    if (isSelectorOpened) {
      return;
    }

    if (elementName === directShip) {
      setSelectedLocation(null);
      return;
    }

    setIsSelectorOpened(true);

    // TODO: Change this to open the store selector only if it wasn't yet selected for the product
    // TODO: Opening the selector to change selection should be done with a "Choose Location" link
    FulfillmentSheet.open(handleSelectorClose);
  }, [isSelectorOpened, handleSelectorClose]);

  if (!fulfillmentMethods) {
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
            {location && (
              <StockInfo location={selectedLocation || location} />
            )}
          </FulfillmentSelectorItem>
        </RadioGroup>
      </div>
    </SurroundPortals>
  );
};

FulfillmentSelector.propTypes = {
  productId: PropTypes.string.isRequired,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    code: PropTypes.string,
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

export default hot(connect(FulfillmentSelector));
