import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const hint = {
  fontSize: '0.875rem',
  color: colors.shade9,
};

export default {
  disabled,
  hint,
};
