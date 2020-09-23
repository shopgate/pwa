import React, { useCallback } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InfoIcon } from '@shopgate/engage/components';
import { nl2br, showModal as showModalAction } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const mapDispatchToProps = {
  showModal: showModalAction,
};

const { variables } = themeConfig;

const styles = {
  textWrapper: css({
    paddingTop: variables.gap.xsmall,
    fontSize: '0.75rem',
    color: 'var(--color-state-alert)',
  }).toString(),
  iconWrapper: css({
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
    display: 'inline-flex',
    verticalAlign: 'bottom',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '1.375rem',
    },
  }).toString(),
};

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const CheckoutSectionInfo = ({ text, showModal, renderIcon }) => {
  const showPopup = useCallback(() => {
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
      <div className={styles.textWrapper} dangerouslySetInnerHTML={{ __html: nl2br(text) }} />
    );
  }

  return (
    <span
      onClick={showPopup}
      onKeyDown={showPopup}
      className={styles.iconWrapper}
      role="button"
      tabIndex={0}
    >
      <InfoIcon />
    </span>
  );
};

CheckoutSectionInfo.propTypes = {
  showModal: PropTypes.func.isRequired,
  renderIcon: PropTypes.bool,
  text: PropTypes.string,
};

CheckoutSectionInfo.defaultProps = {
  text: null,
  renderIcon: true,
};

export default connect(null, mapDispatchToProps)(CheckoutSectionInfo);
