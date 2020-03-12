// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { title } from './FulfillmentSelector.style';

/**
 * Renders the fulfillment selector title.
 * @returns {JSX}
 */
export function FulfillmentSelectorTitle() {
  return (
    <div role="heading" aria-hidden className={title}>
      {i18n.text('locations.fulfillment.heading')}
    </div>
  );
}
