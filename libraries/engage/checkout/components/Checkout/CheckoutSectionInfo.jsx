import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InfoIcon, Typography, SafeHtml } from '@shopgate/engage/components';
import { showModal as showModalAction } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

const mapDispatchToProps = {
  showModal: showModalAction,
};

const useStyles = makeStyles()(theme => ({
  textWrapper: {
    paddingTop: theme.spacing(0.5),
    whiteSpace: 'pre-line',
  },
  iconWrapper: {
    cursor: 'pointer',
    color: theme.palette.primary.main,
    fontSize: theme.components.icon.medium,
    display: 'inline-flex',
    verticalAlign: 'bottom',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      fontSize: theme.components.icon.medium,
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
      <SafeHtml
        as={Typography}
        variant="caption"
        component="div"
        color="error"
        className={classes.textWrapper}
        html={text}
      />
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
