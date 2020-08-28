import React from 'react';
import classNames from 'classnames';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { useCookieConsent } from '../../hooks';

const { variables } = themeConfig;

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'flex-end',
    [responsiveMediaQuery('<sm')]: {
      justifyContent: 'flex-start',
    },
  }).toString(),
  button: css({
    borderRadius: '6px !important',
    margin: `0 ${variables.gap.small}px`,
    fontSize: '.875rem !important',
    whiteSpace: 'nowrap',
  }).toString(),
  buttonSecondary: css({
    [responsiveMediaQuery('<sm')]: {

      marginLeft: 0,
      paddingLeft: 0,
      ' > div': {
        paddingLeft: 0,
      },
    },
  }).toString(),
  buttonPrimary: css({
    minWidth: '150px !important',
  }).toString(),
  labelSelected: css({
    color: 'var(--color-text-medium-emphasis)',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const CookieConsentButtons = () => {
  const { onClickSecondary, onClickPrimary, buttonLabels } = useCookieConsent();

  return (
    <div className={styles.container}>
      <RippleButton
        className={classNames(styles.button, styles.buttonSecondary)}
        flat
        onClick={onClickSecondary}
      >
        <I18n.Text string={buttonLabels.secondary} className={styles.labelSelected} />
      </RippleButton>
      <RippleButton className={classNames(styles.button, styles.buttonPrimary)} type="secondary" onClick={onClickPrimary}>
        <I18n.Text string={buttonLabels.primary} />
      </RippleButton>
    </div>
  );
};

export default CookieConsentButtons;
