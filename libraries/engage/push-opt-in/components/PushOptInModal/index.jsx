import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import pushImage from './push-opt-in.svg';
import styles from './style';
import connect from './connector';

/**
 * The Push opt-in modal component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const PushOptInModal = ({
  showPushOptInModal, allowPushOptInModal, denyPushOptInModal,
}) => {
  if (!showPushOptInModal) {
    return null;
  }

  return (
    <Modal isOpened={showPushOptInModal}>
      <Grid className={styles.container}>
        <Grid.Item className={styles.item}>
          <img src={pushImage} className={styles.image} alt="" aria-hidden="true" />
          <I18n.Text className={styles.title} string="pushNotification.title" />
          <I18n.Text string="pushNotification.message" />
          <Button onClick={allowPushOptInModal} type="primary" className={styles.button}>
            <I18n.Text string="pushNotification.buttonAllow" />
          </Button>
          <Button onClick={denyPushOptInModal} type="plain" className={styles.button}>
            <I18n.Text string="pushNotification.buttonDeny" className={styles.buttonText} />
          </Button>
        </Grid.Item>
      </Grid>
    </Modal>
  );
};

PushOptInModal.propTypes = {
  allowPushOptInModal: PropTypes.func.isRequired,
  denyPushOptInModal: PropTypes.func.isRequired,
  showPushOptInModal: PropTypes.bool,
};

PushOptInModal.defaultProps = {
  showPushOptInModal: false,
};

export default connect(PushOptInModal);
