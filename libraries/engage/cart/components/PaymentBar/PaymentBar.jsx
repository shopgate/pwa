// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { createPortal } from 'react-dom';
import PaymentBarContent from './PaymentBarContent';

type PaymentBarProps = {
  visible?: boolean;
}

/**
 * The cart payment bar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PaymentBar({ visible }: PaymentBarProps) {
  const domElement = document.getElementById('AppFooter');

  if (!visible || !domElement) {
    return null;
  }

  return createPortal(<PaymentBarContent />, domElement);
}

PaymentBar.defaultProps = {
  visible: true,
};

export default hot(PaymentBar);
