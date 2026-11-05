import { useContext } from 'react';
import { errorBehavior, isIOSTheme } from '@shopgate/engage/core';
import { Typography, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';

export interface CouponMessage {
  message: string;
  type: string;
  additionalParams?: Record<string, unknown>;
}

export interface PaymentBarPromotionCouponMessagesProps {
  messages?: CouponMessage[];
}

const useStyles = makeStyles()(theme => ({
  line: {
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      paddingBottom: 3,
    },
  },
  message: {
    order: 2,
  },
  error: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  info: {
    color: theme.palette.success.main,
  },
  loading: {
    opacity: 0.4,
  },
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
}));

/**
 * The messages of a coupon.
 * @returns The message lines or null.
 */
const PaymentBarPromotionCouponMessages = ({
  messages = [],
}: PaymentBarPromotionCouponMessagesProps) => {
  const { classes, cx } = useStyles();
  const { isLoading } = useContext(CartContext);
  if (!messages.length) {
    return null;
  }

  return (
    <>
      {messages.map(({ message, additionalParams, type }) => (
        <CartTotalLine className={classes.line} key={message}>
          <>
            <CartTotalLine.Spacer className={classes.spacer} />
            <div className={cx(classes.message, {
              [classes.loading]: isLoading,
              [classes.error]: type === 'error',
              [classes.warning]: type === 'warning',
              [classes.info]: type === 'info',
            })}
            >
              <Typography variant="caption" component="span">
                {errorBehavior.getErrorMessage(message, additionalParams)}
              </Typography>
            </div>
          </>
        </CartTotalLine>
      ))}
    </>
  );
};

export default PaymentBarPromotionCouponMessages;
