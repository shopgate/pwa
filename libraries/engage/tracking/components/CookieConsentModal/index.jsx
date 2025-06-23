import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import {
  Grid, I18n, Button, Modal, Link, ConditionalWrapper,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import classNames from 'classnames';
import connect from './connector';
import cookieImage from './tracking-opt-in.svg';
import styles from './style';
import { svgToDataUrl } from '../../../core';

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
  privacyPolicyLink,
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
    if (!modalImageURL && !modalImageSVG) {
      return cookieImage;
    }

    if (modalImageURL) {
      return modalImageURL;
    }
    return svgToDataUrl(modalImageSVG, cookieImage);
  }, [modalImageSVG, modalImageURL]);

  // Button event handlers are throttled to prevent multiple clicks
  const handleAcceptAllCookies = useCallback(
    throttle(acceptAllCookies, 1000, { leading: true, trailing: false }),
    []
  );

  const handleAcceptRequiredCookies = useCallback(
    throttle(acceptRequiredCookies, 1000, { leading: true, trailing: false }),
    []
  );

  const handleOpenPrivacySettings = useCallback(
    throttle(openPrivacySettings, 1000, { leading: true, trailing: false }),
    []
  );

  if (!isCookieConsentModalVisible) {
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
              <ConditionalWrapper
                condition={!!privacyPolicyLink}
                wrapper={children => (
                  <Link href={privacyPolicyLink} tag="span">
                    {children}
                  </Link>
                )}
              >
                <I18n.Text string="cookieConsentModal.privacyText" className={styles.link} />
              </ConditionalWrapper>
            </I18n.Placeholder>
          </I18n.Text>

          <Grid.Item component="div" className={styles.buttonWrapper}>
            <Button
              onClick={handleAcceptAllCookies}
              type="primary"
              className={classNames(styles.button, 'cookie-consent-modal__button-accept-all')}
            >
              <I18n.Text string={modalButtonAcceptAll || 'cookieConsentModal.buttonAcceptAll'} />
            </Button>
            {showRequiredCookiesButton ? (
              <Button
                onClick={handleAcceptRequiredCookies}
                type="simple"
                className={classNames(styles.button, 'cookie-consent-modal__button-accept-required')}
              >
                <I18n.Text string={modalButtonOnlyRequired || 'cookieConsentModal.modalButtonOnlyRequired'} />
              </Button>
            ) : null}
            <Button
              onClick={handleOpenPrivacySettings}
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
  privacyPolicyLink: PropTypes.string,
};

CookieConsentModal.defaultProps = {
  privacyPolicyLink: null,
};

export default connect(CookieConsentModal);
