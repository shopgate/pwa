import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { nl2br, showModal as showModalAction, isIOSTheme } from '@shopgate/engage/core';
import { InfoIcon } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';

const mapDispatchToProps = {
  showModal: showModalAction,
};

const { variables } = themeConfig;

const useStyles = makeStyles()({
  textWrapper: {
    padding: `${variables.gap.xsmall}px 0`,
    color: 'var(--color-state-alert)',
    order: 3,
  },
  line: {
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '0.75rem',
      paddingBottom: 3,
      verticalAlign: 'text-bottom',
    },
  },
  iconWrapper: {
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
    display: 'inline-flex',
    verticalAlign: 'bottom',
    paddingBottom: 1,
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
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const PaymentBarPromotionalText = ({ text, showModal, renderIcon }) => {
  const { classes, cx } = useStyles();
  const { isLoading } = useContext(CartContext);
  const showText = useCallback(() => {
    showModal({
      message: text,
      title: null,
      confirm: null,
      dismiss: 'modal.ok',
    });
  }, [showModal, text]);

  if (!text) {
    return null;
  }

  if (!renderIcon) {
    return (
      <CartTotalLine className={classes.line}>
        <>
          <div
            className={cx(classes.textWrapper, {
              [classes.loading]: isLoading,
            })}
            dangerouslySetInnerHTML={{ __html: nl2br(text) }}
          />
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

PaymentBarPromotionalText.propTypes = {
  showModal: PropTypes.func.isRequired,
  renderIcon: PropTypes.bool,
  text: PropTypes.string,
};

PaymentBarPromotionalText.defaultProps = {
  text: null,
  renderIcon: true,
};

export default connect(null, mapDispatchToProps)(PaymentBarPromotionalText);
