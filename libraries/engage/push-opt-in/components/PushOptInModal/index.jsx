import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import pushImage from './push-opt-in.svg';
import styles from './style';
import connect from './connector';
import { svgToDataUrl } from '../../../core';

/**
 * The Push opt-in modal component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const PushOptInModal = ({
  isPushOptInModalVisible, allowPushOptIn, denyPushOptIn,
}) => {
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
  const handleAllowPushOptIn = useCallback(
    throttle(allowPushOptIn, 1000, { leading: true, trailing: false }),
    []
  );

  const handleDenyPushOptIn = useCallback(
    throttle(denyPushOptIn, 1000, { leading: true, trailing: false }),
    []
  );

  if (!isPushOptInModalVisible) {
    return null;
  }

  return (
    <Modal
      classes={{
        content: styles.modalContent,
        layout: styles.modalLayout,
      }}
    >
      <Grid
        className={classNames(styles.container, 'push-opt-in-modal__container')}
        role="alertdialog"
        aria-modal
        aria-labelledby="pushOptInDialogTitle"
        aria-describedby="pushOptInDialogMessage"
      >
        <Grid.Item className={styles.item}>
          <img src={imageSRC} className={classNames(styles.image, 'push-opt-in-modal__image')} alt="" aria-hidden="true" />
          <I18n.Text
            className={classNames(styles.title, 'push-opt-in-modal__title')}
            string={modalTitle || 'pushOptInModal.title'}
            id="pushOptInDialogTitle"
          />
          <I18n.Text
            className={classNames('push-opt-in-modal__message')}
            string={modalMessage || 'pushOptInModal.message'}
            id="pushOptInDialogMessage"
          />
          <Button onClick={handleAllowPushOptIn} type="primary" className={classNames(styles.button, 'push-opt-in-modal__button-allow')}>
            <I18n.Text string={modalButtonAllow || 'pushOptInModal.buttonAllow'} />
          </Button>
          <Button onClick={handleDenyPushOptIn} type="plain" className={classNames(styles.button, 'push-opt-in-modal__button-deny')}>
            <I18n.Text string={modalButtonDeny || 'pushOptInModal.buttonDeny'} className={styles.buttonText} />
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
