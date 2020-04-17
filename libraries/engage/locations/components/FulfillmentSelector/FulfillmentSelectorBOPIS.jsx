import React from 'react';
import classNames from 'classnames';
import { i18n } from '../../../core';
import { IN_STORE_PICKUP_BOPIS_LABEL } from '../../constants';
import { itemRowDisabled } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/**
 * Renders the FulfillmentSelectorBOPIS components.
 * @returns {JSX}
 */
export function FulfillmentSelectorBOPIS() {
  const { isBOPISEnabled, isReady } = useFulfillmentSelectorState();
  const classes = classNames({
    [itemRowDisabled.toString()]: !isReady || !isBOPISEnabled,
  });

  return (
    <div className={classes}>
      {i18n.text(IN_STORE_PICKUP_BOPIS_LABEL)}
    </div>
  );
}
