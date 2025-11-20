import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '../../../components';
import {
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
  STAGE_SELECT_STORE,
  PRODUCT_FULFILLMENT_SELECTOR,
} from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
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

/* eslint-disable max-len */
/** @typedef {import('./FulfillmentSelector.types').FulfillmentSelectorContextProps} FulfillmentSelectorContextProps */
/** @typedef {import('./FulfillmentSelector.types').OwnProps} OwnProps */
/** @typedef {import('./FulfillmentSelector.types').StateProps} StateProps */
/** @typedef {import('./FulfillmentSelector.types').DispatchProps} DispatchProps */
/** @typedef {import('../../locations.types').UserLocationFulfillmentMethod} UserLocationFulfillmentMethod */
/* eslint-enable max-len */

/**
 * @typedef {OwnProps & StateProps & DispatchProps} Props
 */

/**
 * Renders the fulfillment selector radio button group.
 * @param {Props} props The component props.
 * @returns {JSX.Element|null}
 */
const FulfillmentSelector = (props) => {
  const {
    productId,
    merchantSettings,
    shopFulfillmentMethods,
    productFulfillmentMethods,
    locationFulfillmentMethods,
    useLocationFulfillmentMethods,
    preferredLocation,
    inventory,
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

  const [selection, setSelection] = useState(userFulfillmentMethod);
  const [selectedLocation, setSelectedLocation] = useState(preferredLocation);
  const [isOpen, setIsOpen] = useState(false);

  const usedLocation = selectedLocation || preferredLocation;

  // Initialize fo selection once it is available.
  useEffect(() => {
    if (!selection && userFulfillmentMethod) {
      setSelection(userFulfillmentMethod);
    }
  }, [selection, userFulfillmentMethod]);

  // Initialize location selection once it is available.
  useEffect(() => {
    if (!selectedLocation && preferredLocation) {
      setSelectedLocation(preferredLocation);
    }
  }, [preferredLocation, selectedLocation]);

  /** @type {UserLocationFulfillmentMethod} */
  const fulfillmentMethodFallback = useMemo(() => {
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
    if (preferredLocation?.code !== selectedLocation?.code) {
      setSelectedLocation(preferredLocation);
    }
  }, [preferredLocation, selectedLocation, shopFulfillmentMethods]);

  const handleClose = useCallback((newLocationData) => {
    setIsOpen(false);

    if (!newLocationData && (!usedLocation || !usedLocation.code)) {
      setSelection(fulfillmentMethodFallback);
      return;
    }

    if (newLocationData) {
      setSelectedLocation(newLocationData.location);
    }
  }, [fulfillmentMethodFallback, usedLocation]);

  const handleChange = useCallback((method, changeOnly = false) => {
    conditioner.without('fulfillment-inventory').check().then((passed) => {
      if (!passed) {
        return;
      }

      setSelection(method);
      storeFulfillmentMethod(method);

      const isValidRopeSelection =
        [ROPIS, BOPIS].includes(method) && !!preferredLocation && !!preferredLocation.code;

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
  }, [conditioner, handleClose, isOpen, preferredLocation, storeFulfillmentMethod]);

  const shopHasRopeMethods = useMemo(() => {
    if (!Array.isArray(shopFulfillmentMethods)) {
      return false;
    }

    return shopFulfillmentMethods.filter(method => method !== DIRECT_SHIP).length > 0;
  },
  [shopFulfillmentMethods]);

  if (!shopHasRopeMethods) {
    return null;
  }

  const context = /** @type {FulfillmentSelectorContextProps} */ ({
    selection,
    selectedLocation,
    inventory,
    preferredLocation,
    isDirectShipEnabled,
    isBOPISEnabled,
    isROPISEnabled,
    isReady,
    productId,
    handleChange,
    conditioner,
    merchantSettings,
    fulfillmentPaths,
    userFulfillmentMethod,
    isOrderable,
    shopFulfillmentMethods,
    productFulfillmentMethods,
    locationFulfillmentMethods,
    useLocationFulfillmentMethods,
  });

  return (
    <FulfillmentSelectorContext.Provider value={context}>
      <SurroundPortals portalName={PRODUCT_FULFILLMENT_SELECTOR}>
        <div className={container} role="radiogroup" tabIndex="0">
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
      </SurroundPortals>
      <FulfillmentSelectorLocation />
      <FulfillmentSelectorAddToCart />
    </FulfillmentSelectorContext.Provider>
  );
};

FulfillmentSelector.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  fulfillmentPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  isBOPISEnabled: PropTypes.bool.isRequired,
  isDirectShipEnabled: PropTypes.bool.isRequired,
  isOrderable: PropTypes.bool.isRequired,
  isReady: PropTypes.bool.isRequired,
  isROPISEnabled: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  storeFulfillmentMethod: PropTypes.func.isRequired,
  inventory: PropTypes.shape(),
  locationFulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  merchantSettings: PropTypes.shape(),
  preferredLocation: PropTypes.shape(),
  productFulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  shopFulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  useLocationFulfillmentMethods: PropTypes.bool,
  userFulfillmentMethod: PropTypes.string,
};

FulfillmentSelector.defaultProps = {
  merchantSettings: null,
  shopFulfillmentMethods: null,
  productFulfillmentMethods: null,
  locationFulfillmentMethods: null,
  useLocationFulfillmentMethods: false,
  preferredLocation: null,
  inventory: null,
  userFulfillmentMethod: null,
};

export default connect(React.memo(FulfillmentSelector));
