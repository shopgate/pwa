import React, {
  Fragment, useCallback, useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { UIEvents } from '@shopgate/pwa-core';
import { Card } from '@shopgate/engage/components';
import FulfillmentSlotSwitcherDefault from './FulfillmentSlotSwitcherDefault';
import FulfillmentSlotSwitcherBar from './FulfillmentSlotSwitcherBar';
import connect from './FulfillmentSlotSwitcher.connector';
import Dialog from './FulfillmentSlotDialog';

const EVENT_FORCE_OPEN = 'FULFILLMENT_SLOT_FORCE_OPEN';

const styles = {
  card: css({
    boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.05)',
    marginLeft: -1,
    marginRight: -1,
    ' > div > div': {
      borderBottom: 0,
    },
    ' > div': {
      borderRadius: 5,
      margin: -1,
      background: '#fff',
      border: '1px solid #eaeaea',
    },
  }).toString(),
};

/**
 * Force opens the fulfillment slot dialog and returns a promise.
 * @returns {Promise}
 */
export const forceOpenFulfillmentSlotDialog = () => new Promise((resolve) => {
  UIEvents.emit(EVENT_FORCE_OPEN, { resolve });
});

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcher = ({
  fulfillmentSlot,
  renderBar,
  isFulfillmentScheduling,
  standalone,
  card,
  setFulfillmentSlot,
}) => {
  const promiseRef = useRef(null);

  // Handle sheet.
  const [isOpen, setOpen] = useState(false);
  const [allowClose, setAllowClose] = useState(true);
  const handleClose = useCallback(() => {
    setOpen(false);
    setAllowClose(true);
  }, []);
  const handleOpen = useCallback(() => {
    setOpen(true);
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

  const Wrapper = card ? Card : Fragment;

  return (
    <Fragment>
      { renderBar ? (
        <Wrapper className={styles.card}>
          <FulfillmentSlotSwitcherBar
            fulfillmentSlot={fulfillmentSlot}
            handleChange={handleOpen}
            standalone={standalone}
          />
        </Wrapper>
      ) : (
        <FulfillmentSlotSwitcherDefault
          fulfillmentSlot={fulfillmentSlot}
          handleChange={handleOpen}
          standalone={standalone}
        />
      )
      }
      <Dialog
        allowClose={allowClose}
        isOpen={isOpen}
        onClose={handleClose}
        onChange={handleUpdate}
      />
    </Fragment>
  );
};

FulfillmentSlotSwitcher.propTypes = {
  setFulfillmentSlot: PropTypes.func.isRequired,
  card: PropTypes.bool,
  fulfillmentSlot: PropTypes.shape(),
  isFulfillmentScheduling: PropTypes.bool,
  renderBar: PropTypes.bool,
  standalone: PropTypes.bool,
};
FulfillmentSlotSwitcher.defaultProps = {
  isFulfillmentScheduling: false,
  fulfillmentSlot: null,
  renderBar: false,
  card: false,
  standalone: false,
};

export default connect(FulfillmentSlotSwitcher);
