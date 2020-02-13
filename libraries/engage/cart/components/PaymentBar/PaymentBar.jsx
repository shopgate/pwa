// @flow
import * as React from 'react';
import { createPortal } from 'react-dom';
import PaymentBarContent from './PaymentBarContent';

const domElement = document.getElementById('AppFooter');

type PaymentBarProps = {
  visible?: boolean;
}

/**
 * The cart payment bar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PaymentBar({ visible }: PaymentBarProps) {
  if (!visible || domElement === null) {
    return null;
  }

  return createPortal(<PaymentBarContent />, domElement);
}

PaymentBar.defaultProps = {
  visible: true,
};

export default PaymentBar;
