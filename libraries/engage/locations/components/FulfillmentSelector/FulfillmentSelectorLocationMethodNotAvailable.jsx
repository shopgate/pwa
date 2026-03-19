import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Availability } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { ROPIS, BOPIS } from '../../constants';

const useStyles = makeStyles()({
  container: {
    fontSize: '0.625rem',
  },
});

/**
 * @returns {JSX}
 */
export function FulfillmentSelectorLocationMethodNotAvailable({ method }) {
  const { classes } = useStyles();
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
      className={classes.container}
      showWhenAvailable
      text={label}
      state={AVAILABILITY_STATE_ALERT}
    />
  );
}

FulfillmentSelectorLocationMethodNotAvailable.propTypes = {
  method: PropTypes.string.isRequired,
};
