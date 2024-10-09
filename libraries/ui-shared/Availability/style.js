import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const stateOk = css({
  fontSize: '0.875rem',
  color: `var(--color-state-ok, ${themeConfig.colors.success})`,
}).toString();

const stateWarning = css({
  fontSize: '0.875rem',
  color: `var(--color-state-warning, ${themeConfig.colors.warning})`,
}).toString();

const stateAlert = css({
  fontSize: '0.875rem',
  color: `var(--color-state-alert, ${themeConfig.colors.error})`,
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
