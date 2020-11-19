import React, { useMemo, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { showModal } from '@shopgate/engage/core';
import { deleteCouponsFromCart } from '@shopgate/engage/cart';
import { I18n, CrossIcon, InfoIcon } from '@shopgate/engage/components';
import { CartContext } from '../../cart.context';
import { useCartItem } from './CartItem.hooks';

const { variables } = themeConfig;

const styles = {
  container: css({
    flex: '0 1 auto',
    textAlign: 'right',
    color: 'var(--color-secondary)',
  }).toString(),
  deleteIcon: css({
    backgroundColor: '#898989',
    color: '#fff',
    borderRadius: 32,
    padding: 4,
    marginRight: variables.gap.small,
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'inline-flex',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      padding: 3,
    },
  }).toString(),
  infoIconWrapper: css({
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
    display: 'inline-flex',
    verticalAlign: 'bottom',
    paddingBottom: 1,
    marginLeft: variables.gap.small,
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '1.375rem',
      paddingBottom: 0,
    },
  }).toString(),
  icon: css({
    display: 'inline',
  }).toString(),
  loading: css({
    opacity: 0.5,
  }).toString(),
};

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
 * @returns {JSX}
 */
const PromotionalTextInfoIcon = ({ text, showText }) => {
  const { isLoading } = useContext(CartContext);

  if (!text) {
    return null;
  }

  return (
    <span
      onClick={() => showText(text)}
      onKeyDown={() => showText(text)}
      className={classNames(styles.infoIconWrapper, {
        [styles.loading]: isLoading,
      })}
      role="button"
      tabIndex={0}
    >
      <InfoIcon className={styles.icon} />
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
  isCoupon, isPromo, deleteCoupon, showTextModal,
}) => {
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
      <div className={styles.container}>
        { name }
        <PromotionalTextInfoIcon text={promotionalText} showText={showText} />
      </div>
    );
  }

  if (isCoupon && coupon) {
    const promotionalText = coupon?.promotionalText;
    const code = coupon?.coupon?.code;

    return (
      <div className={styles.container}>
        <div
          className={styles.deleteIcon}
          onClick={() => { deleteCoupon(code); }}
          onKeyDown={() => { deleteCoupon(code); }}
          role="button"
          tabIndex={0}
        >
          <CrossIcon />
        </div>
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
  isCoupon: PropTypes.bool,
  isPromo: PropTypes.bool,
};

CartItemProductPriceListPromotion.defaultProps = {
  isCoupon: false,
  isPromo: false,
};

export default connect(null, mapDispatchToProps)(CartItemProductPriceListPromotion);
