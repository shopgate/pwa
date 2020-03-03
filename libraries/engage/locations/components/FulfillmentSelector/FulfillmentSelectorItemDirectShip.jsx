import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { Availability } from '@shopgate/engage/components';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import connect from './FulfillmentSelectorItemDirectShip.connector';
import { radioItemLabel } from './FulfillmentSelector.style';

/**
 * @param {ReactNode} children .
 * @param {boolean} selected .
 * @param {boolean} isOrderable .
 * @returns {JSX}
 */
const FulfillmentSelectorItemDirectShip = ({ children, selected, isOrderable }) => {
  if (!selected) {
    return null;
  }

  if (!isOrderable) {
    return (
      <Availability
        className={radioItemLabel}
        showWhenAvailable
        text={i18n.text('product.fulfillment_selector.error.direct_ship_not_orderable')}
        state={AVAILABILITY_STATE_ALERT}
      />
    );
  }

  return children;
};

FulfillmentSelectorItemDirectShip.propTypes = {
  children: PropTypes.node.isRequired,
  isOrderable: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default connect(memo(FulfillmentSelectorItemDirectShip));
