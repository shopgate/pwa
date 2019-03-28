import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const totalValue = css({
  fontSize: '0.875rem',
  textAlign: 'right',
}).toString();

export default {
  disabled,
  totalValue,
};
