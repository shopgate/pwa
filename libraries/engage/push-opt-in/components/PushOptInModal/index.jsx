import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import pushImage from './push-opt-in.svg';
import connect from './connector';
import { svgToDataUrl } from '../../../core';

const useStyles = makeStyles()((theme) => {
  const overlayColor = theme?.colors?.lightOverlay || 'var(--color-background)';
  const secondaryTextColor = theme?.colors?.gray || 'var(--color-text-low-emphasis)';

  return ({
    modalContent: {
      width: '100%',
    },
    modalLayout: {
      backgroundColor: overlayColor,
    },
    container: {
      backgroundColor: overlayColor,
      textAlign: 'center',
      padding: '30px',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      fontSize: '1.35rem',
      paddingTop: '30px',
      paddingBottom: '30px',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    image: {
      width: '80%',
      maxWidth: 400,
    },
    button: {
      marginTop: '30px',
    },
    buttonText: {
      color: secondaryTextColor,
    },
  });
});

/**
 * The Push opt-in modal component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const PushOptInModal = ({
  isPushOptInModalVisible, allowPushOptIn, denyPushOptIn,
}) => {
  const { classes } = useStyles();
  const {
    pushOptIn: {
      modalMessage,
      modalTitle,
      modalButtonDeny,
      modalButtonAllow,
      modalImageURL,
      modalImageSVG,
    } = {},
  } = appConfig;

  const imageSRC = useMemo(() => {
    if (!modalImageURL && !modalImageSVG) {
      return pushImage;
    }

    if (modalImageURL) {
      return modalImageURL;
    }

    return svgToDataUrl(modalImageSVG, pushImage);
  }, [modalImageSVG, modalImageURL]);

  // Button event handlers are throttled to prevent multiple clicks
  const handleAllowPushOptIn = useMemo(() => throttle(allowPushOptIn, 1000, {
    leading: true,
    trailing: false,
  }),
  [allowPushOptIn]);

  const handleDenyPushOptIn = useMemo(() => throttle(denyPushOptIn, 1000, {
    leading: true,
    trailing: false,
  }),
  [denyPushOptIn]);

  useEffect(() => () => {
    handleAllowPushOptIn.cancel();
    handleDenyPushOptIn.cancel();
  }, [handleAllowPushOptIn, handleDenyPushOptIn]);

  if (!isPushOptInModalVisible) {
    return null;
  }

  return (
    <Modal
      classes={{
        content: classes.modalContent,
        layout: classes.modalLayout,
      }}
    >
      <Grid
        className={classNames(classes.container, 'push-opt-in-modal__container')}
        role="alertdialog"
        aria-modal
        aria-labelledby="pushOptInDialogTitle"
        aria-describedby="pushOptInDialogMessage"
      >
        <Grid.Item className={classes.item}>
          <img src={imageSRC} className={classNames(classes.image, 'push-opt-in-modal__image')} alt="" aria-hidden="true" />
          <I18n.Text
            className={classNames(classes.title, 'push-opt-in-modal__title')}
            string={modalTitle || 'pushOptInModal.title'}
            id="pushOptInDialogTitle"
          />
          <I18n.Text
            className={classNames('push-opt-in-modal__message')}
            string={modalMessage || 'pushOptInModal.message'}
            id="pushOptInDialogMessage"
          />
          <Button onClick={handleAllowPushOptIn} type="primary" className={classNames(classes.button, 'push-opt-in-modal__button-allow')}>
            <I18n.Text string={modalButtonAllow || 'pushOptInModal.buttonAllow'} />
          </Button>
          <Button onClick={handleDenyPushOptIn} type="plain" className={classNames(classes.button, 'push-opt-in-modal__button-deny')}>
            <I18n.Text string={modalButtonDeny || 'pushOptInModal.buttonDeny'} className={classes.buttonText} />
          </Button>
        </Grid.Item>
      </Grid>
    </Modal>
  );
};

PushOptInModal.propTypes = {
  allowPushOptIn: PropTypes.func.isRequired,
  denyPushOptIn: PropTypes.func.isRequired,
  isPushOptInModalVisible: PropTypes.bool.isRequired,
};

export default connect(PushOptInModal);
