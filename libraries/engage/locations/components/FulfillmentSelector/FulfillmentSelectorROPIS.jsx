import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core';
import { IN_STORE_PICKUP_ROPIS_LABEL } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

const useStyles = makeStyles()({
  itemRowDisabled: {
    opacity: 0.3,
  },
});

/**
 * Renders the FulfillmentSelectorROPIS components.
 * @returns {JSX}
 */
export function FulfillmentSelectorROPIS() {
  const { classes, cx } = useStyles();
  const { isROPISEnabled, isReady } = useFulfillmentSelectorState();
  const className = cx({
    [classes.itemRowDisabled]: !isReady || !isROPISEnabled,
  });

  return (
    <div className={className}>
      {i18n.text(IN_STORE_PICKUP_ROPIS_LABEL)}
    </div>
  );
}
