import React, { Fragment, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { nl2br, showModal as showModalAction } from '@shopgate/engage/core';
import { InfoIcon } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { spacer } from './PaymentBarContent.style';
import { CartContext } from '../../cart.context';

const mapDispatchToProps = {
  showModal: showModalAction,
};

const { variables } = themeConfig;

const styles = {
  textWrapper: css({
    padding: `${variables.gap.xsmall}px 0`,
    color: 'var(--color-state-alert)',
    order: 3,
  }).toString(),
  line: css({
    justifyContent: 'start',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '0.75rem',
      paddingBottom: 3,
      verticalAlign: 'text-bottom',
    },
  }).toString(),
  message: css({
    order: 2,
  }).toString(),
  iconWrapper: css({
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
  }).toString(),
  icon: css({
    display: 'inline',
  }).toString(),
  loading: css({
    opacity: 0.5,
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const PaymentBarPromotionalText = ({ text, showModal, renderIcon }) => {
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
      <CartTotalLine className={styles.line}>
        <Fragment>
          <div
            className={classNames(styles.textWrapper, {
              [styles.loading]: isLoading,
            })}
            dangerouslySetInnerHTML={{ __html: nl2br(text) }}
          />
          <CartTotalLine.Spacer className={spacer} />
        </Fragment>
      </CartTotalLine>
    );
  }

  return (
    <span
      onClick={showText}
      onKeyDown={showText}
      className={classNames(styles.iconWrapper, {
        [styles.loading]: isLoading,
      })}
      role="button"
      tabIndex={0}
    >
      <InfoIcon className={styles.icon} />
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
