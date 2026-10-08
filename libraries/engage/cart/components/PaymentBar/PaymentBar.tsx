import { createPortal } from 'react-dom';
import { FooterBar } from '@shopgate/engage/components';
import type { FooterBarVariant } from '@shopgate/engage/settings/types/appSettings';
import PaymentBarContent from './PaymentBarContent';

export interface PaymentBarProps {
  visible?: boolean;
  showSeparator?: boolean;
  /** Without a variant the bar renders into the app footer as it always did. */
  variant?: FooterBarVariant | null;
  /** Space in px between a floating bar and a visible tab bar. */
  gap?: number;
}

/**
 * The cart payment bar component. Without a variant it renders as it always did. With a variant
 * it sits on top of the tab bar; `floating` leaves only the checkout button in the bar, so the
 * totals have to be rendered in the page via `PaymentBarTotals`.
 * @returns The payment bar.
 */
function PaymentBar({
  visible = true, showSeparator = false, variant = null, gap,
}: PaymentBarProps) {
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

export default PaymentBar;
