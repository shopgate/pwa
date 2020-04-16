// @flow
import { hot } from 'react-hot-loader/root';
import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import {
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
  STAGE_SELECT_STORE,
} from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
import {
  type UserLocationFulfillmentMethod,
} from '../../locations.types';
import {
  type OwnProps,
  type StateProps,
  type DispatchProps,
  type Selection,
  type FulfillmentSelectorContextProps,
} from './FulfillmentSelector.types';
import { FulfillmentSelectorContext } from './FulfillmentSelector.context';
import { FulfillmentSelectorHeader } from './FulfillmentSelectorHeader';
import { FulfillmentSelectorItem } from './FulfillmentSelectorItem';
import { FulfillmentSelectorDirectShip } from './FulfillmentSelectorDirectShip';
import { FulfillmentSelectorBOPIS } from './FulfillmentSelectorBOPIS';
import { FulfillmentSelectorROPIS } from './FulfillmentSelectorROPIS';
import { FulfillmentSelectorAddToCart } from './FulfillmentSelectorAddToCart';
import { FulfillmentSelectorLocation } from './FulfillmentSelectorLocation';
import { container } from './FulfillmentSelector.style';
import connect from './FulfillmentSelector.connector';

type Props = OwnProps & StateProps & DispatchProps;

/**
 * Renders the fulfillment selector radio button group.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FulfillmentSelector(props: Props) {
  const {
    productId,
    shopFulfillmentMethods,
    productFulfillmentMethods,
    location,
    conditioner,
    isDirectShipEnabled,
    isROPISEnabled,
    isBOPISEnabled,
    storeFulfillmentMethod,
    userFulfillmentMethod,
    fulfillmentPaths,
    isOrderable,
    isReady,
  } = props;

  const [selection, setSelection] = useState<Selection>(userFulfillmentMethod);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [isOpen, setIsOpen] = useState(false);

  const usedLocation = selectedLocation || location;

  const fulfillmentMethodFallback = useMemo<UserLocationFulfillmentMethod>(() => {
    if (!shopFulfillmentMethods) {
      return null;
    }
    const states = [isDirectShipEnabled, isBOPISEnabled, isROPISEnabled];
    return [DIRECT_SHIP, BOPIS, ROPIS].find(
      (method, index) => states[index] && shopFulfillmentMethods.includes(method)
    ) || null;
  }, [isBOPISEnabled, isDirectShipEnabled, isROPISEnabled, shopFulfillmentMethods]);

  /**
   * Determine and set a default fulfillment method when none was set before.
   */
  useEffect(() => {
    if (!shopFulfillmentMethods) {
      return;
    }

    /**
     * The user has already set a fulfillment method which is supported by the shop, so we don't
     * need to apply the fallback. We don't check against the product fulfillment methods to
     * avoid too much auto magic when navigating through catalogs with different set up products.
     */
    if (userFulfillmentMethod && shopFulfillmentMethods.includes(userFulfillmentMethod)) {
      return;
    }

    if (fulfillmentMethodFallback !== userFulfillmentMethod) {
      setSelection(fulfillmentMethodFallback);
      storeFulfillmentMethod(fulfillmentMethodFallback);
    }
  }, [
    fulfillmentMethodFallback,
    isBOPISEnabled,
    isDirectShipEnabled,
    isROPISEnabled,
    shopFulfillmentMethods,
    storeFulfillmentMethod,
    userFulfillmentMethod,
  ]);

  useEffect(() => {
    if (JSON.stringify(location) !== JSON.stringify(selectedLocation)) {
      setSelectedLocation(location);
    }
  }, [location, selectedLocation, shopFulfillmentMethods]);

  /**
   * Updates the selected location when the sheet closes.
   */
  const handleClose = useCallback((newLocationData) => {
    setIsOpen(false);

    if (!newLocationData && (!usedLocation || !usedLocation.code)) {
      // Reset the UI back to directShip if there was no location selected already
      setSelection(fulfillmentMethodFallback);
      return;
    }

    if (newLocationData) {
      // Update the selected location only when the selection was done for the same product.
      setSelectedLocation(newLocationData.location);
    }
  }, [fulfillmentMethodFallback, usedLocation]);

  /**
   * Whenever the pick-up selection is made, open the
   * store selector sheet and use the new location.
   */
  const handleChange = useCallback((method, changeOnly = false) => {
    conditioner.without('fulfillment-inventory').check().then((passed) => {
      if (!passed) {
        return;
      }

      setSelection(method);
      storeFulfillmentMethod(method);

      const isValidRopeSelection =
        [ROPIS, BOPIS].includes(method) && !!location && !!location.code;

      if (!changeOnly && (isOpen || isValidRopeSelection)) {
        return;
      }

      if (method === DIRECT_SHIP) {
        setSelectedLocation(null);
        return;
      }

      setIsOpen(true);
      FulfillmentSheet.open({
        stage: STAGE_SELECT_STORE,
        callback: handleClose,
        changeOnly,
      });
    });
  }, [conditioner, handleClose, isOpen, location, storeFulfillmentMethod]);

  if (!Array.isArray(shopFulfillmentMethods) || shopFulfillmentMethods.length === 0) {
    return null;
  }

  const context: FulfillmentSelectorContextProps = {
    selection,
    selectedLocation,
    location: location || null,
    isDirectShipEnabled,
    isBOPISEnabled,
    isROPISEnabled,
    isReady,
    productId,
    handleChange,
    conditioner,
    fulfillmentPaths,
    userFulfillmentMethod,
    isOrderable,
    shopFulfillmentMethods,
    productFulfillmentMethods,
  };

  return (
    <FulfillmentSelectorContext.Provider value={context}>
      <div className={container}>
        <FulfillmentSelectorHeader />
        {shopFulfillmentMethods.includes(DIRECT_SHIP) && (
          <FulfillmentSelectorItem
            name={DIRECT_SHIP}
            onChange={handleChange}
            disabled={!isReady || !isDirectShipEnabled}
          >
            <FulfillmentSelectorDirectShip />
          </FulfillmentSelectorItem>
        )}

        {shopFulfillmentMethods.includes(BOPIS) && (
          <FulfillmentSelectorItem
            name={BOPIS}
            onChange={handleChange}
            disabled={!isReady || !isBOPISEnabled}
          >
            <FulfillmentSelectorBOPIS />
          </FulfillmentSelectorItem>
        )}

        {shopFulfillmentMethods.includes(ROPIS) && (
          <FulfillmentSelectorItem
            name={ROPIS}
            onChange={handleChange}
            disabled={!isReady || !isROPISEnabled}
          >
            <FulfillmentSelectorROPIS />
          </FulfillmentSelectorItem>
        )}
      </div>
      <FulfillmentSelectorLocation />
      <FulfillmentSelectorAddToCart />
    </FulfillmentSelectorContext.Provider>
  );
}

export default hot(connect(React.memo<Props>(FulfillmentSelector)));
