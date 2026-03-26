import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InfoIcon } from '@shopgate/engage/components';
import { nl2br, showModal as showModalAction } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

const mapDispatchToProps = {
  showModal: showModalAction,
};

const useStyles = makeStyles()(theme => ({
  textWrapper: {
    paddingTop: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: 'var(--color-state-alert)',
  },
  iconWrapper: {
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
    display: 'inline-flex',
    verticalAlign: 'bottom',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: '1.375rem',
    },
  },
}));

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const CheckoutSectionInfo = ({ text, showModal, renderIcon }) => {
  const { classes } = useStyles();

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
      // eslint-disable-next-line react/no-danger
      <div className={classes.textWrapper} dangerouslySetInnerHTML={{ __html: nl2br(text) }} />
    );
  }

  return (
    <span
      onClick={showPopup}
      onKeyDown={showPopup}
      className={classes.iconWrapper}
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
