import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const stateOk = css({
  color: `var(--color-state-ok, ${themeConfig.colors.success})`,
}).toString();

const stateWarning = css({
  color: `var(--color-state-warning, ${themeConfig.colors.warning})`,
}).toString();

const stateAlert = css({
  color: `var(--color-state-alert, ${themeConfig.colors.error})`,
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
