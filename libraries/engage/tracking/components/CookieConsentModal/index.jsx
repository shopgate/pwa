import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, Button, Modal, Link,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import { PRIVACY_PATH } from '@shopgate/engage/page';
import classNames from 'classnames';
import connect from './connector';
import cookieImage from './tracking-opt-in.svg';
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
  openPrivacySettings,
}) => {
  const {
    cookieConsent: {
      modalMessage,
      modalTitle,
      modalButtonConfigureSettings,
      modalButtonOnlyRequired,
      modalButtonAcceptAll,
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
    <Modal
      isOpened={isCookieConsentModalVisible}
      classes={{
        content: styles.modalContent,
        layout: styles.modalLayout,
      }}
    >
      <Grid
        component="div"
        className={classNames(styles.container, 'cookie-consent-modal__container')}
        role="alertdialog"
        aria-modal
        aria-labelledby="cookieConsentDialogTitle"
        aria-describedby="cookieConsentDialogMessage"
      >
        <Grid.Item component="div" className={styles.item}>
          <img src={imageSRC} className={classNames(styles.image, 'cookie-consent-modal__image')} alt="" aria-hidden="true" />
          <I18n.Text
            className={classNames(styles.title, 'cookie-consent-modal__title')}
            string={modalTitle || 'cookieConsentModal.title'}
            id="cookieConsentDialogTitle"
          />
          <I18n.Text
            string={modalMessage || 'cookieConsentModal.message'}
            className={classNames('cookie-consent-modal__message')}
            acceptPlainTextWithPlaceholders
            id="cookieConsentDialogMessage"
          >
            <I18n.Placeholder forKey="privacyLink">
              <Link href={PRIVACY_PATH} tag="span">
                <I18n.Text string="cookieConsentModal.privacyText" className={styles.link} />
              </Link>
            </I18n.Placeholder>
          </I18n.Text>

          <Grid.Item component="div" className={styles.buttonWrapper}>
            <Button
              onClick={acceptAllCookies}
              type="primary"
              className={classNames(styles.button, 'cookie-consent-modal__button-accept-all')}
            >
              <I18n.Text string={modalButtonAcceptAll || 'cookieConsentModal.buttonAcceptAll'} />
            </Button>
            {showRequiredCookiesButton ? (
              <Button
                onClick={acceptRequiredCookies}
                type="simple"
                className={classNames(styles.button, 'cookie-consent-modal__button-accept-required')}
              >
                <I18n.Text string={modalButtonOnlyRequired || 'cookieConsentModal.modalButtonOnlyRequired'} />
              </Button>
            ) : null}
            <Button
              onClick={openPrivacySettings}
              type="simple"
              className={classNames(styles.button, 'cookie-consent-modal__button-open-settings')}
            >
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
  openPrivacySettings: PropTypes.func.isRequired,
};

export default connect(CookieConsentModal);
