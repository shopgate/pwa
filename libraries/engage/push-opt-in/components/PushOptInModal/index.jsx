import React from 'react';
import PropTypes from 'prop-types';
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
      modalImage,
      modalButtonDeny,
      modalButtonAllow,
    },
  } = appConfig;

  if (!isPushOptInModalVisible) {
    return null;
  }

  return (
    <Modal isOpened={isPushOptInModalVisible}>
      <Grid className={styles.container}>
        <Grid.Item className={styles.item}>
          <img src={modalImage || pushImage} className={styles.image} alt="" aria-hidden="true" />
          <I18n.Text
            className={styles.title}
            string={modalTitle || 'pushNotification.title'}
          />
          <I18n.Text string={modalMessage || 'pushNotification.message'} />
          <Button onClick={allowPushOptIn} type="primary" className={styles.button}>
            <I18n.Text string={modalButtonAllow || 'pushNotification.buttonAllow'} />
          </Button>
          <Button onClick={denyPushOptIn} type="plain" className={styles.button}>
            <I18n.Text string={modalButtonDeny || 'pushNotification.buttonDeny'} className={styles.buttonText} />
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
