import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Button, Modal,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import connect from './connector';
import cookieImage from './cookieConsent.svg';
import styles from './style';

/**
 * The cookie consent modal component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CookieConsentModal = ({
  isCookieConsentModalVisible, acceptAllCookies, acceptRequiredCookies, openSettings,
}) => {
  const {
    cookieConsent: {
      modalMessage,
      modalTitle,
      modalButtonConfigureSettings,
      modalButtonOnlyRequired,
      modalButtonAccept,
      modalImageURL,
      modalImageSVG,
    } = {},
  } = appConfig;

  const imageSRC = useMemo(() => {
    // if no overwrite configured: use default image
    if (!modalImageURL && !modalImageSVG) {
      return cookieImage;
    }

    // if URL overwrite configured: use it
    if (modalImageURL) {
      return modalImageURL;
    }

    // if SVG overwrite configured: create data url
    try {
      // Remove any characters outside the Latin1 range
      const decoded = decodeURIComponent(encodeURIComponent(modalImageSVG));

      // Now we can use btoa to convert the svg to base64
      const base64 = btoa(decoded);

      return `data:image/svg+xml;base64,${base64}`;
    } catch (e) {
      return cookieImage;
    }
  }, [modalImageSVG, modalImageURL]);

  if (!isCookieConsentModalVisible) {
    return null;
  }

  return (
    <Modal isOpened={isCookieConsentModalVisible} classes={{ content: styles.modalContent }}>
      <Grid className={styles.container}>
        <Grid.Item className={styles.item}>
          <img src={imageSRC} className={styles.image} alt="" aria-hidden="true" />
          <I18n.Text
            className={styles.title}
            string={modalTitle || 'cookieConsentModal.title'}
          />
          <I18n.Text
            string={modalMessage || 'cookieConsentModal.message'}
          />
          <Button onClick={acceptAllCookies} type="primary" className={styles.button}>
            <I18n.Text string={modalButtonAccept || 'cookieConsentModal.buttonAllow'} />
          </Button>
          <Button onClick={acceptRequiredCookies} type="outline" className={styles.button}>
            <I18n.Text string={modalButtonOnlyRequired || 'cookieConsentModal.modalButtonOnlyRequired'} />
          </Button>
          <Button onClick={openSettings} type="outline" className={styles.button}>
            <I18n.Text string={modalButtonConfigureSettings || 'cookieConsentModal.buttonConfigure'} />
          </Button>
        </Grid.Item>
      </Grid>
    </Modal>
  );
};

CookieConsentModal.propTypes = {
  acceptAllCookies: PropTypes.func.isRequired,
  acceptRequiredCookies: PropTypes.func.isRequired,
  isCookieConsentModalVisible: PropTypes.bool.isRequired,
  openSettings: PropTypes.func.isRequired,
};

export default connect(CookieConsentModal);
