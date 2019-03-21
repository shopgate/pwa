import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS,
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS_BEFORE,
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import portalProps from '../../totalsPortalProps';
import TotalRow from '../TotalRow';
import Label from './components/Label';
import Amount from './components/Amount';
import connect from './connector';

/**
 * The Discounts component.
 * @returns {React.Node}
 */
const Discounts = ({ discounts }) => {
  if (!discounts) {
    return null;
  }

  return (
    <Fragment>
      <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS_BEFORE} props={portalProps} />
      <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS} props={portalProps}>
        {discounts.map(({ label, amount }) => (
          <TotalRow key={`${label}-${amount}`}>
            <Label label={label} />
            <Amount value={amount} />
          </TotalRow>
        ))}
      </Portal>
      <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS_AFTER} props={portalProps} />
    </Fragment>
  );
};

Discounts.propTypes = {
  discounts: PropTypes.arrayOf(PropTypes.shape()),
};

Discounts.defaultProps = {
  discounts: null,
};

export default connect(Discounts);
