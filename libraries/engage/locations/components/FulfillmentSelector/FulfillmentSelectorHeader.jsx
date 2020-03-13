// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { container } from './FulfillmentSelectorHeader.style';

/**
 * Renders the fulfillment selector title.
 * @returns {JSX}
 */
export function FulfillmentSelectorHeader() {
  return (
    <div role="heading" aria-hidden className={container}>
      {i18n.text('locations.fulfillment.heading')}
    </div>
  );
}
