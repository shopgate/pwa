import React, { useMemo, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { showModal } from '@shopgate/engage/core';
import { deleteCouponsFromCart } from '@shopgate/engage/cart';
import { I18n, CrossIcon, InfoIcon } from '@shopgate/engage/components';
import { CartContext } from '../../cart.context';
import { useCartItem } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  container: {
    flex: '0 1 auto',
    color: 'var(--color-secondary)',
    paddingRight: 8,
  },
  deleteIcon: {
    backgroundColor: '#898989',
    color: '#fff',
    borderRadius: 32,
    padding: 4,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'inline-flex',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      padding: 3,
    },
  },
  infoIconWrapper: {
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
    display: 'inline-flex',
    verticalAlign: 'bottom',
    paddingBottom: 1,
    marginLeft: theme.spacing(1),
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '1.375rem',
      paddingBottom: 0,
    },
  },
  icon: {
    display: 'inline',
  },
  loading: {
    opacity: 0.5,
  },
}));

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
  showTextModal: text => dispatch(showModal({
    message: text,
    title: null,
    confirm: null,
    dismiss: 'modal.ok',
  })),
});

/**
 * @param {Object} props The component props
 * @param {string} props.text The promotional text
 * @param {Function} props.showText The function to show the promotional text
 * @returns {JSX.Element}
 */
const PromotionalTextInfoIcon = ({ text, showText }) => {
  const { classes } = useStyles();
  const { isLoading } = useContext(CartContext);

  if (!text) {
    return null;
  }

  return (
    <span
      onClick={() => showText(text)}
      onKeyDown={() => showText(text)}
      className={classNames(classes.infoIconWrapper, {
        [classes.loading]: isLoading,
      })}
      role="button"
      tabIndex={0}
    >
      <InfoIcon className={classes.icon} />
    </span>
  );
};

PromotionalTextInfoIcon.propTypes = {
  showText: PropTypes.func.isRequired,
  text: PropTypes.string,
};

PromotionalTextInfoIcon.defaultProps = {
  text: null,
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartItemProductPriceListPromotion = ({
  isCoupon, isPromo, deleteCoupon, showTextModal, className,
}) => {
  const { classes } = useStyles();
  const { cartItem = {} } = useCartItem();
  const appliedPromotions = cartItem?.appliedPromotions;

  const promo = useMemo(() => {
    if (!appliedPromotions) {
      return null;
    }

    return appliedPromotions.find(entry => entry.coupon === null);
  }, [appliedPromotions]);

  const coupon = useMemo(() => {
    if (!appliedPromotions) {
      return null;
    }

    return appliedPromotions.find(entry => entry.coupon !== null);
  }, [appliedPromotions]);

  const showText = useCallback((text) => {
    showTextModal(text);
  }, [showTextModal]);

  if (isPromo && promo) {
    const promotionalText = promo?.promotionalText;
    const name = promo?.name;
    return (
      <div className={classNames(classes.container, className)}>
        { name }
        <PromotionalTextInfoIcon text={promotionalText} showText={showText} />
      </div>
    );
  }

  if (isCoupon && coupon) {
    const promotionalText = coupon?.promotionalText;
    const code = coupon?.coupon?.code;

    return (
      <div className={classNames(classes.container, className)}>
        <span
          className={classes.deleteIcon}
          onClick={() => { deleteCoupon(code); }}
          onKeyDown={() => { deleteCoupon(code); }}
          role="button"
          tabIndex={0}
        >
          <CrossIcon />
        </span>
        <I18n.Text string="cart.coupon_label" params={{ label: code }} />
        <PromotionalTextInfoIcon text={promotionalText} showText={showText} />
      </div>
    );
  }

  return (
    null
  );
};

CartItemProductPriceListPromotion.propTypes = {
  deleteCoupon: PropTypes.func.isRequired,
  showTextModal: PropTypes.func.isRequired,
  className: PropTypes.string,
  isCoupon: PropTypes.bool,
  isPromo: PropTypes.bool,
};

CartItemProductPriceListPromotion.defaultProps = {
  isCoupon: false,
  isPromo: false,
  className: null,
};

export default connect(null, mapDispatchToProps)(CartItemProductPriceListPromotion);
