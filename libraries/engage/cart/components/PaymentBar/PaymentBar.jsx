import * as React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { FooterBar } from '@shopgate/engage/components';
import PaymentBarContent from './PaymentBarContent';

/**
 * The cart payment bar component. Without a variant it renders as it always did. With a variant
 * it sits on top of the tab bar; `floating` leaves only the checkout button in the bar, so the
 * totals have to be rendered in the page via `PaymentBarTotals`.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PaymentBar({
  visible, showSeparator, variant, gap,
}) {
  const domElement = document.getElementById('AppFooter');

  if (!visible || !domElement) {
    return null;
  }

  if (!variant) {
    return createPortal(<PaymentBarContent showSeparator={showSeparator} />, domElement);
  }

  return (
    <FooterBar variant={variant} gap={gap}>
      <PaymentBarContent
        showSeparator={showSeparator}
        embedded
        checkoutOnly={variant === 'floating'}
      />
    </FooterBar>
  );
}

PaymentBar.propTypes = {
  gap: PropTypes.number,
  showSeparator: PropTypes.bool,
  variant: PropTypes.oneOf(['fixed', 'floating']),
  visible: PropTypes.bool,
};

PaymentBar.defaultProps = {
  gap: undefined,
  visible: true,
  showSeparator: false,
  variant: null,
};

export default PaymentBar;
