import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const stateOk = css({
  color: themeConfig.colors.success,
}).toString();

const stateWarning = css({
  color: themeConfig.colors.warning,
}).toString();

const stateAlert = css({
  color: themeConfig.colors.error,
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
