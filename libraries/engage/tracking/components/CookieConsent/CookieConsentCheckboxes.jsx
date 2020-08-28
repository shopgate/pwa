import React from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import { Checkbox } from '@shopgate/pwa-ui-shared';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core';
import { useCookieConsent } from '../../hooks';

const { variables, colors } = themeConfig;

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
  }),
  label: css({
    fontWeight: 500,
    marginRight: variables.gap.big,
  }).toString(),
  checkboxContainer: css({
    display: 'flex',
    padding: `0 ${variables.gap.small}px`,
    alignItems: 'center',
    ' > svg': {
      maxWidth: 'inherit',
    },
  }).toString(),
  checkbox: css({
    marginLeft: variables.gap.xsmall,
    cursor: 'pointer',
  }).toString(),
  checked: css({
    color: 'var(--color-primary)',
  }).toString(),
  unchecked: css({
    color: colors.shade6,
  }).toString(),
  disabled: css({
    opacity: 0.5,
    color: colors.shade6,
    cursor: 'not-allowed',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const CookieConsentCheckboxes = () => {
  const { allowAnalytics, onClickAllowAnalytics } = useCookieConsent();

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        {`${i18n.text('tracking.cookieConsent.preferences')}:`}
      </span>

      <Checkbox
        checked
        disabled
        className={styles.checkboxContainer}
        checkedClassName={classNames(styles.disabled, styles.checkbox)}
        label={i18n.text('tracking.cookieConsent.needed')}
        labelPosition="left"
      />
      <Checkbox
        checked={allowAnalytics}
        className={styles.checkboxContainer}
        checkedClassName={classNames(styles.checkbox, styles.checked)}
        unCheckedClassName={classNames(styles.checkbox, styles.unchecked)}
        onCheck={onClickAllowAnalytics}
        label={i18n.text('tracking.cookieConsent.analytics')}
        labelPosition="left"
      />
    </div>
  );
};

export default CookieConsentCheckboxes;
