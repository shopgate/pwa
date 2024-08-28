import React, { useCallback, useState } from 'react';
import {
  Button, Grid, I18n, Link, Switch,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { PRIVACY_PATH } from '@shopgate/engage/page';
import { appConfig } from '@shopgate/engage';
import { i18n } from '@shopgate/engage/core';
import classNames from 'classnames';
import styles from './style';
import connect from './connector';

/**
 * The PrivacySettings component.
 * @returns {JSX.Element}
 */
const PrivacySettings = ({
  acceptAllCookies,
  acceptSelectedCookies,
  comfortCookiesAcceptedState,
  statisticsCookiesAcceptedState,
}) => {
  const {
    cookieConsent: {
      settingsComfortText,
      settingsComfortTitle,
      settingsStatisticsText,
      settingsStatisticsTitle,
      settingsRequiredText,
      settingsRequiredTitle,
      showComfortCookiesToggle,
    } = {},
  } = appConfig;

  const [areComfortCookiesSelected, setAreComfortCookiesSelected] = useState(
    comfortCookiesAcceptedState !== null ? comfortCookiesAcceptedState : false
  );
  const [areStatisticsCookiesSelected, setAreStatisticsCookiesSelected] = useState(
    statisticsCookiesAcceptedState !== null ? statisticsCookiesAcceptedState : false
  );

  const handleChangeComfortCookies = useCallback(() => {
    setAreComfortCookiesSelected(!areComfortCookiesSelected);
  }, [areComfortCookiesSelected]);

  const handleChangeStatisticsCookies = useCallback(() => {
    setAreStatisticsCookiesSelected(!areStatisticsCookiesSelected);
  }, [areStatisticsCookiesSelected]);

  const handleAcceptAllCookies = useCallback(() => {
    setAreStatisticsCookiesSelected(true);
    setAreComfortCookiesSelected(true);
    acceptAllCookies();
  }, [acceptAllCookies]);

  return (
    <Grid component="div" className={styles.container}>
      <Grid.Item component="div" className={styles.item}>
        {showComfortCookiesToggle ? (
          <Grid.Item component="div" className={styles.switchWrapper}>
            <Switch
              onChange={handleChangeComfortCookies}
              checked={areComfortCookiesSelected}
              a11yFallbackText={`${i18n.text(settingsComfortTitle || 'cookieSettings.comfortTitle')}. ${i18n.text(settingsComfortText || 'cookieSettings.comfort')}`}
            >
              <span className={styles.title}>
                {<I18n.Text string={settingsComfortTitle || 'cookieSettings.comfortTitle'} />}
              </span>
              <span>{<I18n.Text string={settingsComfortText || 'cookieSettings.comfort'} />}</span>
            </Switch>
          </Grid.Item>
        ) : null}
        <Grid.Item component="div" className={styles.switchWrapper}>
          <Switch
            onChange={handleChangeStatisticsCookies}
            checked={areStatisticsCookiesSelected}
            a11yFallbackText={`${i18n.text(settingsStatisticsTitle || 'cookieSettings.statisticsTitle')}. ${i18n.text(settingsStatisticsText || 'cookieSettings.statistics')}`}
          >
            <span className={styles.title}>
              {<I18n.Text string={settingsStatisticsTitle || 'cookieSettings.statisticsTitle'} />}
            </span>
            <span>{<I18n.Text string={settingsStatisticsText || 'cookieSettings.statistics'} />}</span>
          </Switch>
        </Grid.Item>
        <Grid.Item component="div" className={styles.switchWrapper}>
          <Switch
            disabled
            checked
            a11yFallbackText={`${i18n.text(settingsRequiredTitle || 'cookieSettings.requiredTitle')}. ${i18n.text(settingsRequiredText || 'cookieSettings.required')}`}
          >
            <span className={styles.title}>
              {<I18n.Text string={settingsRequiredTitle || 'cookieSettings.requiredTitle'} />}
            </span>
            <span>{<I18n.Text string={settingsRequiredText || 'cookieSettings.required'} />}</span>
          </Switch>
        </Grid.Item>
      </Grid.Item>
      <Grid.Item component="div" className={styles.buttonWrapper}>
        <Button
          onClick={() => handleAcceptAllCookies()}
          type="primary"
          className={classNames(styles.button, 'privacy-settings__button-accept-all')}
        >
          <I18n.Text string="cookieConsentModal.buttonAcceptAll" />
        </Button>
        <Button
          onClick={() => acceptSelectedCookies({
            comfortCookiesAccepted: areComfortCookiesSelected,
            statisticsCookiesAccepted: areStatisticsCookiesSelected,
          })}
          type="simple"
          className={classNames(styles.button, 'privacy-settings__button-accept-selected')}
        >
          <I18n.Text string="cookieConsentModal.modalButtonConfirmSelected" />
        </Button>
      </Grid.Item>
      <Grid.Item component="div">
        <I18n.Text string="cookieSettings.privacy">
          <I18n.Placeholder forKey="privacyLink">
            <Link href={PRIVACY_PATH} tag="span">
              <I18n.Text string="cookieConsentModal.privacyText" className={styles.link} />
            </Link>
          </I18n.Placeholder>
        </I18n.Text>
      </Grid.Item>
    </Grid>
  );
};

PrivacySettings.propTypes = {
  acceptAllCookies: PropTypes.func.isRequired,
  acceptSelectedCookies: PropTypes.func.isRequired,
  comfortCookiesAcceptedState: PropTypes.bool,
  statisticsCookiesAcceptedState: PropTypes.bool,
};

PrivacySettings.defaultProps = {
  comfortCookiesAcceptedState: null,
  statisticsCookiesAcceptedState: null,
};

export default connect(PrivacySettings);
