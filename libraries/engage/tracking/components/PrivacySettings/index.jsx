import React, { useCallback, useState } from 'react';
import {
  Button, Grid, I18n, Link, Switch, ConditionalWrapper,
} from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { appConfig } from '@shopgate/engage';
import { i18n } from '@shopgate/engage/core/helpers';
import classNames from 'classnames';
import connect from './connector';

const useStyles = makeStyles()({
  button: {
    marginTop: '20px',
  },
  container: {
    flexDirection: 'column',
    height: '100vh',
    textAlign: 'center',
    padding: '30px',
    justifyContent: 'center',
    display: 'flex',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '30px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: 'var(--color-secondary)',
    textDecoration: 'underline',
  },
  switchWrapper: {
    marginBottom: '25px',
    display: 'flex',
    textAlign: 'left',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    display: 'block',
  },
});

/**
 * The PrivacySettings component.
 * @returns {JSX.Element}
 */
const PrivacySettings = ({
  acceptAllCookies,
  acceptSelectedCookies,
  comfortCookiesAcceptedState,
  statisticsCookiesAcceptedState,
  privacyPolicyLink,
}) => {
  const { classes } = useStyles();
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
    <Grid component="div" className={classes.container}>
      <Grid.Item component="div" className={classes.item}>
        {showComfortCookiesToggle ? (
          <Grid.Item component="div" className={classes.switchWrapper}>
            <Switch
              onChange={handleChangeComfortCookies}
              checked={areComfortCookiesSelected}
              a11yFallbackText={`${i18n.text(settingsComfortTitle || 'cookieSettings.comfortTitle')}. ${i18n.text(settingsComfortText || 'cookieSettings.comfort')}`}
            >
              <span className={classes.title}>
                <I18n.Text string={settingsComfortTitle || 'cookieSettings.comfortTitle'} />
              </span>
              <span><I18n.Text string={settingsComfortText || 'cookieSettings.comfort'} /></span>
            </Switch>
          </Grid.Item>
        ) : null}
        <Grid.Item component="div" className={classes.switchWrapper}>
          <Switch
            onChange={handleChangeStatisticsCookies}
            checked={areStatisticsCookiesSelected}
            a11yFallbackText={`${i18n.text(settingsStatisticsTitle || 'cookieSettings.statisticsTitle')}. ${i18n.text(settingsStatisticsText || 'cookieSettings.statistics')}`}
          >
            <span className={classes.title}>
              <I18n.Text string={settingsStatisticsTitle || 'cookieSettings.statisticsTitle'} />
            </span>
            <span><I18n.Text string={settingsStatisticsText || 'cookieSettings.statistics'} /></span>
          </Switch>
        </Grid.Item>
        <Grid.Item component="div" className={classes.switchWrapper}>
          <Switch
            disabled
            checked
            a11yFallbackText={`${i18n.text(settingsRequiredTitle || 'cookieSettings.requiredTitle')}. ${i18n.text(settingsRequiredText || 'cookieSettings.required')}`}
          >
            <span className={classes.title}>
              <I18n.Text string={settingsRequiredTitle || 'cookieSettings.requiredTitle'} />
            </span>
            <span><I18n.Text string={settingsRequiredText || 'cookieSettings.required'} /></span>
          </Switch>
        </Grid.Item>
      </Grid.Item>
      <Grid.Item component="div" className={classes.buttonWrapper}>
        <Button
          onClick={() => handleAcceptAllCookies()}
          type="primary"
          className={classNames(classes.button, 'privacy-settings__button-accept-all')}
        >
          <I18n.Text string="cookieConsentModal.buttonAcceptAll" />
        </Button>
        <Button
          onClick={() => acceptSelectedCookies({
            comfortCookiesAccepted: areComfortCookiesSelected,
            statisticsCookiesAccepted: areStatisticsCookiesSelected,
          })}
          type="simple"
          className={classNames(classes.button, 'privacy-settings__button-accept-selected')}
        >
          <I18n.Text string="cookieConsentModal.modalButtonConfirmSelected" />
        </Button>
      </Grid.Item>
      <Grid.Item component="div">
        <I18n.Text string="cookieSettings.privacy">
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
      </Grid.Item>
    </Grid>
  );
};

PrivacySettings.propTypes = {
  acceptAllCookies: PropTypes.func.isRequired,
  acceptSelectedCookies: PropTypes.func.isRequired,
  comfortCookiesAcceptedState: PropTypes.bool,
  privacyPolicyLink: PropTypes.string,
  statisticsCookiesAcceptedState: PropTypes.bool,
};

PrivacySettings.defaultProps = {
  comfortCookiesAcceptedState: null,
  statisticsCookiesAcceptedState: null,
  privacyPolicyLink: null,
};

export default connect(PrivacySettings);
