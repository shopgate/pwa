import React, { useCallback, useState } from 'react';
import {
  Button, Grid, I18n, Link,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { PRIVACY_PATH } from '@shopgate/theme-gmd/components/NavDrawer/constants';
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
}) => {
  const [areComfortCookiesSelected, setAreComfortCookiesSelected] = useState(false);
  const [areStatisticsCookiesSelected, setAreStatisticsCookiesSelected] = useState(false);

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
      <Grid.Item component="div">
        <Toggle
          label={<I18n.Text string="cookieSettings.comfort" />}
          title={<I18n.Text string="cookieSettings.comfortTitle" />}
          onChange={handleChangeComfortCookies}
          checked={areComfortCookiesSelected}
        />
        <Toggle
          label={<I18n.Text string="cookieSettings.statistics" />}
          title={<I18n.Text string="cookieSettings.statisticsTitle" />}
          onChange={handleChangeStatisticsCookies}
          checked={areStatisticsCookiesSelected}
        />
        <Toggle
          label={<I18n.Text string="cookieSettings.required" />}
          title={<I18n.Text string="cookieSettings.requiredTitle" />}
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
  confirmAllCookies: PropTypes.func.isRequired,
  confirmSelectedCookies: PropTypes.func.isRequired,
};

export default connect(CookieConsentDetail);
