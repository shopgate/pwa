import React from 'react';
import {
  Button, Grid, I18n,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import styles from './style';
import Toggle from '../../../components/Toggle';
import connect from './connector';

/**
 * The CookieConsentDetail component.
 * @returns {JSX.Element}
 */
const CookieConsentDetail = ({
  acceptAllCookies,
  acceptSelectedCookies,
  handleChangeComfortCookies,
  handleChangeStatisticsCookies,
}) => (
  <Grid component="div" className={styles.container}>
    <Grid.Item component="div">
      <Toggle
        label={<I18n.Text string="cookieSettings.comfort" />}
        title={<I18n.Text string="cookieSettings.comfortTitle" />}
        handleChange={handleChangeComfortCookies}
      />
      <Toggle
        label={<I18n.Text string="cookieSettings.statistics" />}
        title={<I18n.Text string="cookieSettings.statisticsTitle" />}
        handleChange={handleChangeStatisticsCookies}
      />
      <Toggle
        label={<I18n.Text string="cookieSettings.required" />}
        title={<I18n.Text string="cookieSettings.requiredTitle" />}
        disabled
      />
    </Grid.Item>
    <Grid.Item component="div" className={styles.buttonWrapper}>
      <Button onClick={acceptAllCookies} type="primary" className={styles.button}>
        <I18n.Text string="cookieConsentModal.buttonAllow" />
      </Button>
      <Button onClick={acceptSelectedCookies} type="outline" className={styles.button}>
        <I18n.Text string="cookieConsentModal.modalButtonConfirmSelected" />
      </Button>
    </Grid.Item>
    <Grid.Item component="div">
      <I18n.Text string="cookieSettings.privacy" />
    </Grid.Item>
  </Grid>
);

CookieConsentDetail.propTypes = {
  acceptAllCookies: PropTypes.func.isRequired,
  acceptSelectedCookies: PropTypes.func.isRequired,
  handleChangeComfortCookies: PropTypes.bool.isRequired,
  handleChangeStatisticsCookies: PropTypes.func.isRequired,
};

export default connect(CookieConsentDetail);
