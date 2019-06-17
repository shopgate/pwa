import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '../../../core';
import LiveMessage from '../LiveMessage';
import {
  EVENT_LIVE_MESSAGE,
  LIVE_MESSAGE_TYPE_ASSERTIVE,
  LIVE_MESSAGE_TYPE_POLITE,
} from './constants';

/**
 * The LiveMessenger component can be used to broadcast `aria-live` messages to assistive
 * technology. It can be placed somewhere within the DOM, and receives its updates via
 * EVENT_LIVE_MESSAGE event.
 * @param {string} id An optional id for the messenger.
 * @returns {JSX}
 */
const LiveMessenger = ({ id }) => {
  const [assertive, setAssertive] = useState({
    message: '', params: null,
  });

  const [polite, setPolite] = useState({
    message: '', params: null,
  });

  const handleMessage = useMemo(() => (message, options) => {
    const { type = LIVE_MESSAGE_TYPE_POLITE, id: instanceId = null, params = null } = options;

    if (id !== instanceId) {
      return;
    }

    if (type === LIVE_MESSAGE_TYPE_ASSERTIVE) {
      setAssertive({
        message, params,
      });
    } else if (type === LIVE_MESSAGE_TYPE_POLITE) {
      setPolite({
        message, params,
      });
    }
  });

  useEffect(() => {
    UIEvents.addListener(EVENT_LIVE_MESSAGE, handleMessage);

    return () => {
      UIEvents.removeListener(EVENT_LIVE_MESSAGE, handleMessage);
    };
  }, []);

  return (
    <div>
      <LiveMessage aria-live="assertive" message={assertive.message} params={assertive.params} />
      <LiveMessage aria-live="polite" message={polite.message} params={polite.params} />
    </div>
  );
};

LiveMessenger.propTypes = {
  id: PropTypes.string,
};

LiveMessenger.defaultProps = {
  id: null,
};

export default LiveMessenger;
