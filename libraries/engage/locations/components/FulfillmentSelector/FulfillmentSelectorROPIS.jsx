import React from 'react';
import classNames from 'classnames';
import { i18n } from '../../../core';
import { IN_STORE_PICKUP_ROPIS_LABEL } from '../../constants';
import { itemRowDisabled } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/**
 * Renders the FulfillmentSelectorROPIS components.
 * @returns {JSX}
 */
export function FulfillmentSelectorROPIS() {
  const { isROPISEnabled, isReady } = useFulfillmentSelectorState();
  const classes = classNames({
    [itemRowDisabled.toString()]: !isReady || !isROPISEnabled,
  });

  return (
    <div className={classes}>
      {i18n.text(IN_STORE_PICKUP_ROPIS_LABEL)}
    </div>
  );
}
