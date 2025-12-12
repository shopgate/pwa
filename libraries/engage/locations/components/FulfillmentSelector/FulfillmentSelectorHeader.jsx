import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { container } from './FulfillmentSelectorHeader.style';

/**
 * Renders the fulfillment selector title.
 * @returns {JSX.Element}
 */
export const FulfillmentSelectorHeader = () => (
  // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
  <div role="heading" className={container}>
    {i18n.text('locations.fulfillment.heading')}
  </div>
);
