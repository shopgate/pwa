import React, { useCallback, useState } from 'react';
import {
  Button, Grid, I18n, Link,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { PRIVACY_PATH } from '@shopgate/theme-gmd/components/NavDrawer/constants';
import { appConfig } from '@shopgate/engage';
import styles from './style';
import Toggle from '../../../components/Toggle';
import connect from './connector';

/**
 * The CookieConsentDetail component.
 * @returns {JSX.Element}
 */
const CookieConsentDetail = ({
  confirmAllCookies,
  confirmSelectedCookies,
  areComfortCookiesSelectedState,
  areStatisticsCookiesSelectedState,
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
    areComfortCookiesSelectedState !== null ? areComfortCookiesSelectedState : false
  );
  const [areStatisticsCookiesSelected, setAreStatisticsCookiesSelected] = useState(
    areStatisticsCookiesSelectedState !== null ? areStatisticsCookiesSelectedState : false
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
    confirmAllCookies();
  }, [confirmAllCookies]);

  return (
    <Grid component="div" className={styles.container}>
      <Grid.Item component="div" className={styles.item}>
        <Toggle
          label={<I18n.Text string={settingsComfortText || 'cookieSettings.comfort'} />}
          title={<I18n.Text string={settingsComfortTitle || 'cookieSettings.comfortTitle'} />}
          onChange={handleChangeComfortCookies}
          checked={areComfortCookiesSelected}
        />
        <Toggle
          label={<I18n.Text string={settingsStatisticsText || 'cookieSettings.statistics'} />}
          title={<I18n.Text string={settingsStatisticsTitle || 'cookieSettings.statisticsTitle'} />}
          onChange={handleChangeStatisticsCookies}
          checked={areStatisticsCookiesSelected}
        />
        <Toggle
          label={<I18n.Text string={settingsRequiredText || 'cookieSettings.required'} />}
          title={<I18n.Text string={settingsRequiredTitle || 'cookieSettings.requiredTitle'} />}
          disabled
          checked
        />
      </Grid.Item>
      <Grid.Item component="div" className={styles.buttonWrapper}>
        <Button
          onClick={() => handleAcceptAllCookies()}
          type="primary"
          className={styles.button}
        >
          <I18n.Text string="cookieConsentModal.buttonAllow" />
        </Button>
        <Button
          onClick={() => confirmSelectedCookies({
            areComfortCookiesSelected,
            areStatisticsCookiesSelected,
          })}
          type="simple"
          className={styles.button}
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

CookieConsentDetail.propTypes = {
  areComfortCookiesSelectedState: PropTypes.bool.isRequired,
  areStatisticsCookiesSelectedState: PropTypes.bool.isRequired,
  confirmAllCookies: PropTypes.func.isRequired,
  confirmSelectedCookies: PropTypes.func.isRequired,
};

export default connect(CookieConsentDetail);
