// @flow
import * as React from 'react';
import { i18n } from '@shopgate/engage/core';
import { Availability } from '@shopgate/engage/components';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { radioItemLabel } from './FulfillmentSelector.style';
import { isProductAvailable } from '../../helpers';
import { type Location } from '../../locations.types';

type Props = {
  children: React.Node,
  selected: boolean,
  location?: Location | null,
}

/**
 * Renders the reserve item of the fulfillment selector.
 * @param {Object} props The component props.
 * @property {React.Node} props.children The component children.
 * @property {boolean} props.selected Whether the item is selected.
 * @property {Object|null} props.location The product location.
 * @returns {JSX}
 */
export const FulfillmentSelectorItemReserve = ({ children, selected, location }: Props) => {
  if (!location) {
    return null;
  }

  if (!selected || isProductAvailable(location)) {
    return children;
  }

  return (
    <React.Fragment>
      <Availability
        className={radioItemLabel}
        showWhenAvailable
        text={i18n.text('locations.fulfillment.error.reserve')}
        state={AVAILABILITY_STATE_ALERT}
      />
      {children}
    </React.Fragment>
  );
};

FulfillmentSelectorItemReserve.defaultProps = {
  location: null,
};
