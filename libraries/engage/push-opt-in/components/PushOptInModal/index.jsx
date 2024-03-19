import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import pushImage from './push-opt-in.svg';
import styles from './style';
import connect from './connector';

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
    // No overwrite configured -> use default image
    if (!modalImageURL && !modalImageSVG) {
      return pushImage;
    }

    // URL overwrite configured -> use it
    if (modalImageURL) {
      return modalImageURL;
    }

    // SVG overwrite configured -> create data url
    try {
      // Remove any characters outside the Latin1 range
      const decoded = decodeURIComponent(encodeURIComponent(modalImageSVG));

      // Now we can use btoa to convert the svg to base64
      const base64 = btoa(decoded);

      return `data:image/svg+xml;base64,${base64}`;
    } catch (e) {
      return pushImage;
    }
  }, [modalImageSVG, modalImageURL]);

  if (!isPushOptInModalVisible) {
    return null;
  }

  return (
    <Modal isOpened={isPushOptInModalVisible} classes={{ content: styles.modalContent }}>
      <Grid className={classNames(styles.container, 'push-opt-in-modal__container')}>
        <Grid.Item className={styles.item}>
          <img src={imageSRC} className={classNames(styles.image, 'push-opt-in-modal__image')} alt="" aria-hidden="true" />
          <I18n.Text
            className={classNames(styles.title, 'push-opt-in-modal__title')}
            string={modalTitle || 'pushOptInModal.title'}
          />
          <I18n.Text
            className={classNames('push-opt-in-modal__message')}
            string={modalMessage || 'pushOptInModal.message'}
          />
          <Button onClick={allowPushOptIn} type="primary" className={classNames(styles.button, 'push-opt-in-modal__button-allow')}>
            <I18n.Text string={modalButtonAllow || 'pushOptInModal.buttonAllow'} />
          </Button>
          <Button onClick={denyPushOptIn} type="plain" className={classNames(styles.button, 'push-opt-in-modal__button-deny')}>
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
