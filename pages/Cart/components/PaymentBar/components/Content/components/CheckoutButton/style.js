import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const button = css({
  width: '100%',
  background: colors.cta,
  color: `${colors.ctaContrast}!important`,

}).toString();

const disabledButton = css({
  width: '100%',
  background: colors.shade7,
  color: `${colors.shade4}!important`,
}).toString();

export default {
  button,
  disabledButton,
};
