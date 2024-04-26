import React, { useCallback, useState } from 'react';
import {
  Button, Grid, I18n, Link, Switch,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { PRIVACY_PATH } from '@shopgate/engage/page';
import { appConfig } from '@shopgate/engage';
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
  areComfortCookiesActiveState,
  areStatisticsCookiesActiveState,
}) => {
  const {
    cookieConsent: {
      settingsComfortText,
      settingsComfortTitle,
      settingsStatisticsText,
      settingsStatisticsTitle,
      settingsRequiredText,
      settingsRequiredTitle,
    } = {},
  } = appConfig;

  const [areComfortCookiesSelected, setAreComfortCookiesSelected] = useState(
    areComfortCookiesActiveState !== null ? areComfortCookiesActiveState : false
  );
  const [areStatisticsCookiesSelected, setAreStatisticsCookiesSelected] = useState(
    areStatisticsCookiesActiveState !== null ? areStatisticsCookiesActiveState : false
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
        <Grid.Item component="div" className={styles.switchWrapper}>
          <Switch
            label={<I18n.Text string={settingsComfortText || 'cookieSettings.comfort'} />}
            title={<I18n.Text string={settingsComfortTitle || 'cookieSettings.comfortTitle'} />}
            onChange={handleChangeComfortCookies}
            checked={areComfortCookiesSelected}
          />
        </Grid.Item>
        <Grid.Item component="div" className={styles.switchWrapper}>
          <Switch
            label={<I18n.Text string={settingsStatisticsText || 'cookieSettings.statistics'} />}
            title={<I18n.Text string={settingsStatisticsTitle || 'cookieSettings.statisticsTitle'} />}
            onChange={handleChangeStatisticsCookies}
            checked={areStatisticsCookiesSelected}
          />
        </Grid.Item>
        <Grid.Item component="div" className={styles.switchWrapper}>
          <Switch
            label={<I18n.Text string={settingsRequiredText || 'cookieSettings.required'} />}
            title={<I18n.Text string={settingsRequiredTitle || 'cookieSettings.requiredTitle'} />}
            disabled
            checked
          />
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
            areComfortCookiesActive: areComfortCookiesSelected,
            areStatisticsCookiesActive: areStatisticsCookiesSelected,
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
  areComfortCookiesActiveState: PropTypes.bool,
  areStatisticsCookiesActiveState: PropTypes.bool,
};

PrivacySettings.defaultProps = {
  areComfortCookiesActiveState: null,
  areStatisticsCookiesActiveState: null,
};

export default connect(PrivacySettings);
