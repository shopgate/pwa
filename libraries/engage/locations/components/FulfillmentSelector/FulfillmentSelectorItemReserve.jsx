import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { Availability } from '@shopgate/engage/components';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { radioItemLabel } from './FulfillmentSelector.style';
import { isProductAvailable } from '../../helpers';

/**
 * @param {ReactNode} children .
 * @param {boolean} selected .
 * @param {Object} location .
 * @returns {JSX}
 */
const FulfillmentSelectorItemReserve = ({ children, selected, location }) => {
  if (!selected || !location) {
    return null;
  }

  if (isProductAvailable(location)) {
    return children;
  }

  return (
    <Fragment>
      <Availability
        className={radioItemLabel}
        showWhenAvailable
        text={i18n.text('product.fulfillment_selector.error.reserve_not_orderable')}
        state={AVAILABILITY_STATE_ALERT}
      />
      {children}
    </Fragment>
  );
};

FulfillmentSelectorItemReserve.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool.isRequired,
  location: PropTypes.shape(),
};

FulfillmentSelectorItemReserve.defaultProps = {
  location: null,
};

export default memo(FulfillmentSelectorItemReserve);
