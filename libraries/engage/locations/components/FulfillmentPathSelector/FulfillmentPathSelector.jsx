// @flow
import * as React from 'react';
import { UIEvents } from '@shopgate/engage/core';
import { SheetList } from '@shopgate/engage/components';
import SheetDrawer from '../../../components/SheetDrawer';
import {
  FULFILLMENT_PATH_QUICK_RESERVE,
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
} from '../../constants';
import { sheetDrawer } from './FulfillmentPathSelector.style';

let callback = null;

const EVENT_SET_OPEN = 'FulfillmentPathSelector.setOpen';

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function FulfillmentPathSelector() {
  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * Handles opening of the sheet.
   */
  function handleOpen() {
    setIsOpen(true);
  }

  React.useEffect(() => {
    UIEvents.addListener(EVENT_SET_OPEN, handleOpen);
    return () => {
      UIEvents.removeListener(EVENT_SET_OPEN, handleOpen);
    };
  }, []);

  /**
   * @param {string} value The selected value.
   */
  function handleSelect(value) {
    if (callback !== null) {
      callback(value);
    }
    setIsOpen(false);
    callback = null;
  }

  /**
   * @param {Object} event The click event.
   */
  function handleQuickReserve(event) {
    event.preventDefault();
    handleSelect(FULFILLMENT_PATH_QUICK_RESERVE);
  }

  /**
   * @param {Object} event The click event.
   */
  function handleReserveToCart(event) {
    event.preventDefault();
    handleSelect(FULFILLMENT_PATH_MULTI_LINE_RESERVE);
  }

  return (
    <SheetDrawer isOpen={isOpen} title="Choose Reservation Type" className={sheetDrawer}>
      <SheetList>
        <SheetList.Item title="Quick Reserve" onClick={handleQuickReserve} />
        <SheetList.Item title="Reserve to cart" onClick={handleReserveToCart} />
      </SheetList>
    </SheetDrawer>
  );
}

FulfillmentPathSelector.open = (callbackFn: (value: string) => void) => {
  callback = callbackFn;
  UIEvents.emit(EVENT_SET_OPEN);
};

export default FulfillmentPathSelector;
