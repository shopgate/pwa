// @flow
import * as React from 'react';
import { UIEvents, i18n } from '@shopgate/engage/core';
import { SheetList } from '@shopgate/engage/components';
import SheetDrawer from '../../../components/SheetDrawer';
import { QUICK_RESERVE, MULTI_LINE_RESERVE } from '../../constants';
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
    handleSelect(QUICK_RESERVE);
  }

  /**
   * @param {Object} event The click event.
   */
  function handleReserveToCart(event) {
    event.preventDefault();
    handleSelect(MULTI_LINE_RESERVE);
  }

  /**
   * Handles the case when the sheet is closed manually.
   */
  function handleClose() {
    if (callback !== null) {
      callback('');
    }

    setIsOpen(false);
    callback = null;
  }

  return (
    <SheetDrawer
      isOpen={isOpen}
      title={i18n.text('locations.choose_reservation_type')}
      className={sheetDrawer}
      onDidClose={handleClose}
    >
      <SheetList>
        <SheetList.Item
          title={i18n.text('locations.quick_reserve')}
          onClick={handleQuickReserve}
        />
        <SheetList.Item
          title={i18n.text('locations.reserve_to_cart')}
          onClick={handleReserveToCart}
        />
      </SheetList>
    </SheetDrawer>
  );
}

FulfillmentPathSelector.open = (callbackFn: (value: string) => void) => {
  callback = callbackFn;
  UIEvents.emit(EVENT_SET_OPEN);
};

export default FulfillmentPathSelector;
