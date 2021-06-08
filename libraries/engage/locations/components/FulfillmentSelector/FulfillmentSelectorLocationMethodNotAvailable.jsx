import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Availability } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { ROPIS, BOPIS } from '../../constants';

export const container = css({
  fontSize: '0.625rem',
}).toString();

/**
 * @returns {JSX}
 */
export function FulfillmentSelectorLocationMethodNotAvailable({ method }) {
  const label = useMemo(() => {
    if (method === ROPIS) {
      return i18n.text('locations.fulfillment.error.ropis');
    } if (method === BOPIS) {
      return i18n.text('locations.fulfillment.error.bopis');
    }

    return null;
  }, [method]);

  if (!label) {
    return null;
  }

  return (
    <Availability
      className={container}
      showWhenAvailable
      text={label}
      state={AVAILABILITY_STATE_ALERT}
    />
  );
}

FulfillmentSelectorLocationMethodNotAvailable.propTypes = {
  method: PropTypes.string.isRequired,
};
