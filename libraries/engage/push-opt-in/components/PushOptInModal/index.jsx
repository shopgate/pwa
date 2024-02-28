import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import { grantPushPermissions } from '@shopgate/engage/core';
import pushImage from './push-opt-in.svg';
import styles from './style';
import connect from './connector';
import { optInPostponed } from '../../action-creators';

/**
 * The PushNotification component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const PushOptInModal = ({ showPushOptInModal }) => {
  /**
   * Denies the permission for sending push notifications
   */
  const handleClickDeny = () => {
    optInPostponed();
  };

  /**
   * Gives the permission for sending push notifications
   */
  const handleClickEnable = () => {
    grantPushPermissions();
  };

  if (!showPushOptInModal) {
    return null;
  }

  return (
    <Modal isOpened={showPushOptInModal}>
      <Grid className={styles.container}>
        <Grid.Item className={styles.item}>
          <img src={pushImage} className={styles.image} alt="push opt-in graphic" />
          <I18n.Text className={styles.title} string="pushNotification.title" />
          <I18n.Text string="pushNotification.message" />
          <Button onClick={handleClickDeny} type="primary" className={styles.button}>
            <I18n.Text string="pushNotification.buttonAllow" />
          </Button>
          <Button onClick={handleClickEnable} type="plain" className={styles.button}>
            <I18n.Text string="pushNotification.buttonDeny" className={styles.buttonText} />
          </Button>
        </Grid.Item>
      </Grid>
    </Modal>
  );
};

PushOptInModal.propTypes = {
  showPushOptInModal: PropTypes.bool,
};

PushOptInModal.defaultProps = {
  showPushOptInModal: false,
};

export default connect(PushOptInModal);
