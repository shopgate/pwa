import React, { Fragment } from 'react';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { TextLink, I18n } from '@shopgate/engage/components';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useCookieConsent } from '../../hooks';

const { variables } = themeConfig;

const styles = {
  container: css({

  }),
  message: css({
    paddingRight: variables.gap.xsmall,
  }).toString(),
  link: css({
    textDecoration: 'underline',
  }).toString(),
};

/**
 * The CookieConsentMessage component
 * @returns {JSX}
 */
const CookieConsentMessage = () => {
  const { privacyPolicyLink } = useCookieConsent();

  return (
    <div className={styles.container}>
      <I18n.Text string="tracking.cookieConsent.message" className={styles.message} />
      { privacyPolicyLink && (
        <Fragment>
          <TextLink className={styles.link} href={privacyPolicyLink}>
            { i18n.text('tracking.cookieConsent.learnMore') }
          </TextLink>
          .
        </Fragment>
      )}
    </div>
  );
};

export default CookieConsentMessage;
