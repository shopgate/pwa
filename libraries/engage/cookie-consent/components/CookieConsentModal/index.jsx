import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Button, Modal, Link,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import { PRIVACY_PATH } from '@shopgate/theme-gmd/components/NavDrawer/constants';
import classNames from 'classnames';
import connect from './connector';
import cookieImage from './cookieConsent.svg';
import styles from './style';

/**
 * The cookie consent modal component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CookieConsentModal = ({
  isCookieConsentModalVisible,
  acceptAllCookies,
  acceptRequiredCookies,
  openSettings,
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
      showRequiredCookiesButton,
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
      <Grid component="div" className={styles.container}>
        <Grid.Item component="div" className={styles.item}>
          <img src={imageSRC} className={styles.image} alt="" aria-hidden="true" />
          <I18n.Text
            className={styles.title}
            string={modalTitle || 'cookieConsentModal.title'}
          />
          <I18n.Text string={modalMessage || 'cookieConsentModal.message'}>
            <I18n.Placeholder forKey="privacyLink">
              <Link href={PRIVACY_PATH} tag="span">
                <I18n.Text string="cookieConsentModal.privacyText" className={styles.link} />
              </Link>
            </I18n.Placeholder>
          </I18n.Text>

          <Grid.Item component="div" className={styles.buttonWrapper}>
            <Button onClick={acceptAllCookies} type="primary" className={classNames(styles.button, 'cookie-modal__allowAll-button')}>
              <I18n.Text string={modalButtonAccept || 'cookieConsentModal.buttonAllow'} />
            </Button>
            {showRequiredCookiesButton ? (
              <Button onClick={acceptRequiredCookies} type="simple" className={classNames(styles.button, 'cookie-modal__allowRequired-button')}>
                <I18n.Text string={modalButtonOnlyRequired || 'cookieConsentModal.modalButtonOnlyRequired'} />
              </Button>
            ) : null}
            <Button onClick={openSettings} type="simple" className={classNames(styles.button, 'cookie-modal__settingsButton')}>
              <I18n.Text string={modalButtonConfigureSettings || 'cookieConsentModal.buttonConfigure'} />
            </Button>
          </Grid.Item>
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
