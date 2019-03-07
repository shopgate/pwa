import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const totalValue = css({
  textAlign: 'right',
}).toString();

export default {
  disabled,
  totalValue,
};
