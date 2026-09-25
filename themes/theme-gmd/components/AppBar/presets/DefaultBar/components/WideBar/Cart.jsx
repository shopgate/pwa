import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Ripple } from '@shopgate/engage/components';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { CartIcon } from '@shopgate/pwa-ui-shared';
import connect from './Cart.connector';
import CartBadge from '../CartBadge';

const useStyles = makeStyles()(theme => ({
  root: {
    cursor: 'pointer',
    marginLeft: 32,
  },
  ripple: {
    display: 'flex',
    flexDirection: 'row',
    margin: -12,
    padding: 12,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  priceHeader: {
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '500',
    paddingBottom: 4,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 24,
    textAlign: 'right',
    color: theme.palette.primary.main,
  },
  icon: {
    display: 'flex',
    flexShrink: 0,
    fontSize: 35,
    marginLeft: 18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    outline: 0,
    color: theme.palette.primary.main,
    padding: 0,
    position: 'relative',
  },
}));

/**
 * Search component
 * @returns {JSX}
 */
const Cart = ({
  navigate,
  total,
  currency,
  count,
}) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const badgeStyles = useMemo(() => ({
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    top: -2,
    right: 2,
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }), [theme]);

  return currency ? (
    <div className={classes.root}>
      <Ripple onClick={navigate} className={classes.ripple} color={theme.palette.primary.main} fill>
        <div className={classes.priceContainer}>
          <span className={classes.priceHeader}>{i18n.text('cart.current_total')}</span>
          <span className={classes.price}>
            {i18n.price(total?.amount || 0, currency, true)}
          </span>
        </div>
        <div className={classes.icon}>
          <CartIcon />
          {count > 0 ? (
            <CartBadge
              style={badgeStyles}
              count={count}
            />
          ) : null}
        </div>
      </Ripple>
    </div>
  ) : null;
};

Cart.propTypes = {
  count: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  currency: PropTypes.string,
  total: PropTypes.shape(),
};

Cart.defaultProps = {
  currency: null,
  total: null,
};

export default connect(Cart);
