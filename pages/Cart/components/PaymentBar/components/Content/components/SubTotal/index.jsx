import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_BEFORE,
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import portalProps from '../../totalsPortalProps';
import TotalRow from '../TotalRow';
import Label from './components/Label';
import Amount from './components/Amount';

/**
 * @returns {JSX}
 */
const SubTotal = () => (
  <Fragment>
    <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_BEFORE} props={portalProps} />
    <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL} props={portalProps}>
      <TotalRow>
        <Label />
        <Amount />
      </TotalRow>
    </Portal>
    <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_AFTER} props={portalProps} />
  </Fragment>
);

export default SubTotal;
