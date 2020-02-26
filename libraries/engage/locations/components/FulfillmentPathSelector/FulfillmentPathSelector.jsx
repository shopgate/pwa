// @flow
import * as React from 'react';
import { SheetList } from '@shopgate/engage/components';
import SheetDrawer from '../../../components/SheetDrawer';
import {
  FULFILLMENT_PATH_QUICK_RESERVE,
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
} from '../../constants';

let callback = null;

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function FulfillmentPathSelector() {
  const [isOpen, setIsOpen] = React.useState(false);

  FulfillmentPathSelector.open = (callbackFn: (value: string) => void) => {
    callback = callbackFn;
    setIsOpen(true);
  };

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
    <SheetDrawer isOpen={isOpen} title="Choose Reservation Type">
      <SheetList>
        <SheetList.Item title="Quick Reserve" onClick={handleQuickReserve} />
        <SheetList.Item title="Reserve to cart" onClick={handleReserveToCart} />
      </SheetList>
    </SheetDrawer>
  );
}

export default FulfillmentPathSelector;
