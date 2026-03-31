import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { makeStyles } from '@shopgate/engage/styles';
import {
  Grid, I18n, Button, Modal, Link, ConditionalWrapper,
} from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import connect from './connector';
import cookieImage from './tracking-opt-in.svg';
import { svgToDataUrl } from '../../../core';

const useStyles = makeStyles()((theme) => {
  const overlayColor = theme?.colors?.lightOverlay || 'var(--color-background)';

  return ({
    modalContent: {
      width: '100%',
    },
    modalLayout: {
      backgroundColor: overlayColor,
    },
    container: {
      backgroundColor: overlayColor,
      padding: '30px',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
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
    link: {
      color: 'var(--color-secondary)',
      textDecoration: 'underline',
    },
    image: {
      width: '60%',
      maxWidth: 400,
    },
    button: {
      marginTop: '20px',
    },
    buttonWrapper: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '30px',
      width: '100%',
    },
  });
});

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
  const { classes, cx } = useStyles();
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
  const handleAcceptAllCookies = useMemo(() => throttle(acceptAllCookies, 1000, {
    leading: true,
    trailing: false,
  }),
  [acceptAllCookies]);

  const handleAcceptRequiredCookies = useMemo(() => throttle(acceptRequiredCookies, 1000, {
    leading: true,
    trailing: false,
  }),
  [acceptRequiredCookies]);

  const handleOpenPrivacySettings = useMemo(() => throttle(openPrivacySettings, 1000, {
    leading: true,
    trailing: false,
  }),
  [openPrivacySettings]);

  useEffect(() => () => {
    handleAcceptAllCookies.cancel();
    handleAcceptRequiredCookies.cancel();
    handleOpenPrivacySettings.cancel();
  }, [handleAcceptAllCookies, handleAcceptRequiredCookies, handleOpenPrivacySettings]);

  if (!isCookieConsentModalVisible) {
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
        component="div"
        className={cx(classes.container, 'cookie-consent-modal__container')}
        role="alertdialog"
        aria-modal
        aria-labelledby="cookieConsentDialogTitle"
        aria-describedby="cookieConsentDialogMessage"
      >
        <Grid.Item component="div" className={classes.item}>
          <img src={imageSRC} className={cx(classes.image, 'cookie-consent-modal__image')} alt="" aria-hidden="true" />
          <I18n.Text
            className={cx(classes.title, 'cookie-consent-modal__title')}
            string={modalTitle || 'cookieConsentModal.title'}
            id="cookieConsentDialogTitle"
          />
          <I18n.Text
            string={modalMessage || 'cookieConsentModal.message'}
            className={cx('cookie-consent-modal__message')}
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
                <I18n.Text string="cookieConsentModal.privacyText" className={classes.link} />
              </ConditionalWrapper>
            </I18n.Placeholder>
          </I18n.Text>

          <Grid.Item component="div" className={classes.buttonWrapper}>
            <Button
              onClick={handleAcceptAllCookies}
              type="primary"
              className={cx(classes.button, 'cookie-consent-modal__button-accept-all')}
            >
              <I18n.Text string={modalButtonAcceptAll || 'cookieConsentModal.buttonAcceptAll'} />
            </Button>
            {showRequiredCookiesButton ? (
              <Button
                onClick={handleAcceptRequiredCookies}
                type="simple"
                className={cx(classes.button, 'cookie-consent-modal__button-accept-required')}
              >
                <I18n.Text string={modalButtonOnlyRequired || 'cookieConsentModal.modalButtonOnlyRequired'} />
              </Button>
            ) : null}
            <Button
              onClick={handleOpenPrivacySettings}
              type="simple"
              className={cx(classes.button, 'cookie-consent-modal__button-open-settings')}
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
