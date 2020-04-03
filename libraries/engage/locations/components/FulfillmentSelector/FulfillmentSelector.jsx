// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { DIRECT_SHIP, IN_STORE_PICKUP, STAGE_SELECT_STORE } from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
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
import { FulfillmentSelectorReserve } from './FulfillmentSelectorReserve';
import { FulfillmentSelectorAddToCart } from './FulfillmentSelectorAddToCart';
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
    disabled,
    storeFulfillmentMethod,
    userFulfillmentMethod,
    fulfillmentPaths,
    isOrderable,
    isReady,
  } = props;

  const isInStoreAndActive = userFulfillmentMethod === IN_STORE_PICKUP && !disabled;

  const [selection, setSelection] = React.useState<Selection>(
    isInStoreAndActive ? IN_STORE_PICKUP : DIRECT_SHIP
  );
  const [selectedLocation, setSelectedLocation] = React.useState(location);
  const [isOpen, setIsOpen] = React.useState(false);

  const usedLocation = selectedLocation || location;

  React.useEffect(() => {
    if (JSON.stringify(location) !== JSON.stringify(selectedLocation)) {
      setSelectedLocation(location);
    }
  }, [location, selectedLocation]);

  /**
   * Updates the selected location when the sheet closes.
   */
  const handleClose = React.useCallback((newLocationData) => {
    setIsOpen(false);

    if (!newLocationData && (!usedLocation || !usedLocation.code)) {
      // Reset the UI back to directShip if there was no location selected already
      setSelection(DIRECT_SHIP);
      return;
    }

    if (newLocationData) {
      // Update the selected location only when the selection was done for the same product.
      setSelectedLocation(newLocationData.location);
    }
  }, [usedLocation]);

  /**
   * Whenever the pick-up selection is made, open the
   * store selector sheet and use the new location.
   */
  const handleChange = React.useCallback((element, changeOnly = false) => {
    conditioner.without('fulfillment-inventory').check().then((passed) => {
      if (!passed) {
        return;
      }

      const method = (element === IN_STORE_PICKUP) ? IN_STORE_PICKUP : DIRECT_SHIP;

      setSelection(element);
      storeFulfillmentMethod(method);

      if (
        !changeOnly
        && (isOpen || ((method === IN_STORE_PICKUP) && (!!location && !!location.code)))
      ) {
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
  }, [conditioner, storeFulfillmentMethod, isOpen, location, handleClose]);

  if (!shopFulfillmentMethods || shopFulfillmentMethods.length === 0) {
    return null;
  }

  const context: FulfillmentSelectorContextProps = {
    selection,
    selectedLocation,
    location: location || null,
    disabled,
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
        <FulfillmentSelectorItem name={DIRECT_SHIP} onChange={handleChange}>
          <FulfillmentSelectorDirectShip />
        </FulfillmentSelectorItem>
        <FulfillmentSelectorItem name={IN_STORE_PICKUP} onChange={handleChange} disabled={disabled}>
          <FulfillmentSelectorReserve />
        </FulfillmentSelectorItem>
      </div>
      <FulfillmentSelectorAddToCart />
    </FulfillmentSelectorContext.Provider>
  );
}

export default hot(connect(React.memo<Props>(FulfillmentSelector)));
