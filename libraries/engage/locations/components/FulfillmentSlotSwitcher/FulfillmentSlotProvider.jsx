import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import Dialog from './FulfillmentSlotDialog';
import connect from './FulfillmentSlotProvider.connector';

const EVENT_FORCE_OPEN = 'FULFILLMENT_SLOT_FORCE_OPEN';

/**
 * Force opens the fulfillment slot dialog and returns a promise.
 * @returns {Promise}
 */
export const forceOpenFulfillmentSlotDialog = () => new Promise((resolve) => {
  UIEvents.emit(EVENT_FORCE_OPEN, { resolve });
});

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const FulfillmentSlotProvider = ({ setFulfillmentSlot, isFulfillmentScheduling }) => {
  const promiseRef = useRef(null);

  // Handle sheet.
  const [isOpen, setOpen] = useState(false);
  const [allowClose, setAllowClose] = useState(true);
  const handleClose = useCallback(() => {
    setOpen(false);
    setAllowClose(true);
  }, []);

  useEffect(() => {
    /** */
    const callback = ({ resolve }) => {
      promiseRef.current = { resolve };
      setAllowClose(true);
      setOpen(true);
    };

    UIEvents.addListener(EVENT_FORCE_OPEN, callback);
    return () => UIEvents.removeListener(EVENT_FORCE_OPEN, callback);
  });

  const handleUpdate = useCallback((slot) => {
    setFulfillmentSlot(slot);

    if (promiseRef.current?.resolve) {
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        promiseRef.current?.resolve(slot);
        promiseRef.current = null;
      }, 10);
    }

    handleClose();
  }, [handleClose, setFulfillmentSlot]);

  if (!isFulfillmentScheduling) {
    return null;
  }

  return (
    <Dialog
      allowClose={allowClose}
      isOpen={isOpen}
      onClose={handleClose}
      onChange={handleUpdate}
    />
  );
};

FulfillmentSlotProvider.propTypes = {
  setFulfillmentSlot: PropTypes.func.isRequired,
  isFulfillmentScheduling: PropTypes.bool,
};
FulfillmentSlotProvider.defaultProps = {
  isFulfillmentScheduling: false,
};

export default connect(FulfillmentSlotProvider);
