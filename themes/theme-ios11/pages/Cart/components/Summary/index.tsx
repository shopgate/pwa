import type { ComponentType } from 'react';
import { Card, SurroundPortals, Typography } from '@shopgate/engage/components';
import { CART_COUPON_FIELD, PaymentBarContent, PaymentBarTotals } from '@shopgate/engage/cart';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import UntypedCouponField from '../CouponField';
import UntypedFooter from '../Footer';

const CouponField = UntypedCouponField as unknown as ComponentType<{
  embedded?: boolean;
  onFocus?: (isFocused: boolean) => void;
}>;
const Footer = UntypedFooter as unknown as ComponentType;

export const SUMMARY_MAX_WIDTH = 400;

export interface SummaryProps {
  /** Sticks next to the items with the checkout button, instead of only listing the totals. */
  sidebar?: boolean;
  /** Called when the coupon field gains or loses focus. */
  onCouponFocus?: (isFocused: boolean) => void;
}

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
    maxWidth: SUMMARY_MAX_WIDTH,
    justifySelf: 'end',
    '&[data-sidebar]': {
      position: 'sticky',
      top: theme.spacing(2),
      maxWidth: 'none',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5, 1.5),
  },
  inset: {
    padding: theme.spacing(0, 1),
  },
  totals: {
    padding: theme.spacing(0, 1),
  },
}));

/**
 * The cart summary for wide screens, with the coupon field and the totals. As a sidebar it also
 * holds the checkout button.
 * @returns The summary.
 */
const Summary = ({ sidebar = false, onCouponFocus }: SummaryProps) => {
  const { classes, cx } = useStyles();

  return (
    <aside className={cx(classes.root, 'theme__cart__summary')} data-sidebar={sidebar || undefined}>
      <Card className={classes.card}>
        <div className={classes.inset}>
          <Typography variant="h3" component="h2">
            {i18n.text('checkout.summary.headline')}
          </Typography>
        </div>
        <div className={classes.inset}>
          <SurroundPortals portalName={CART_COUPON_FIELD}>
            <CouponField embedded onFocus={onCouponFocus} />
          </SurroundPortals>
        </div>
        {sidebar ? (
          <PaymentBarContent showSeparator={false} embedded />
        ) : (
          <PaymentBarTotals showSeparator={false} className={classes.totals} />
        )}
      </Card>
      <Footer />
    </aside>
  );
};

export default Summary;
