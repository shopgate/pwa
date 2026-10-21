import { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { showModal, isIOSTheme } from '@shopgate/engage/core';
import {
  InfoIcon, Typography, CartTotalLine, PlainText,
} from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';

export interface PaymentBarPromotionalTextProps {
  text?: string | null;
  /** Whether an info icon opens the text in a modal instead of showing it inline. */
  renderIcon?: boolean;
}

const useStyles = makeStyles()(theme => ({
  textWrapper: {
    padding: theme.spacing(0.5, 0),
    order: 3,
    whiteSpace: 'pre-line',
  },
  line: {
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      paddingBottom: 3,
      verticalAlign: 'text-bottom',
    },
  },
  iconWrapper: {
    cursor: 'pointer',
    color: theme.palette.primary.main,
    fontSize: theme.components.icon.medium,
    display: 'inline-flex',
    verticalAlign: 'bottom',
    paddingBottom: 1,
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: theme.components.icon.medium,
      paddingBottom: 0,
    },
  },
  icon: {
    display: 'inline',
  },
  loading: {
    opacity: 0.5,
  },
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
}));

/**
 * The promotional text of a promotion, inline or behind an info icon.
 * @returns The text, the icon or null.
 */
const PaymentBarPromotionalText = ({
  text = null, renderIcon = true,
}: PaymentBarPromotionalTextProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => unknown;
  const { isLoading } = useContext(CartContext);
  const showText = useCallback(() => {
    dispatch(showModal({
      message: text,
      title: null,
      confirm: null,
      dismiss: 'modal.ok',
    }));
  }, [dispatch, text]);

  if (!text) {
    return null;
  }

  if (!renderIcon) {
    return (
      <CartTotalLine className={classes.line}>
        <>
          <Typography
            variant="caption"
            component="div"
            color="error"
            className={cx(classes.textWrapper, {
              [classes.loading]: isLoading,
            })}
          >
            <PlainText text={text} />
          </Typography>
          <CartTotalLine.Spacer className={classes.spacer} />
        </>
      </CartTotalLine>
    );
  }

  return (
    <span
      onClick={showText}
      onKeyDown={showText}
      className={cx(classes.iconWrapper, {
        [classes.loading]: isLoading,
      })}
      role="button"
      tabIndex={0}
    >
      <InfoIcon className={classes.icon} />
    </span>
  );
};

export default PaymentBarPromotionalText;
